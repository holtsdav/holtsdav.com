import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from './index.ts';

const valid = { name: 'Test visitor', email: 'visitor@example.com', message: 'A test message.', website: '', token: 'single-use-token' };
function request(fields = {}, headers = {}) {
	return new Request('https://holtsdav.com/api/contact', {
		method: 'POST',
		headers: { Origin: 'https://holtsdav.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers },
		body: JSON.stringify({ ...valid, ...fields }),
	});
}
function fixture(options = {}) {
	const sent = [];
	const tokens = new Set();
	let verificationCalls = 0;
	const env = {
		ALLOWED_ORIGINS: 'https://holtsdav.com,https://www.holtsdav.com',
		TURNSTILE_SITE_KEY: 'test-sitekey',
		TURNSTILE_SECRET: 'test-secret',
		CONTACT_RATE_LIMIT: { limit: async () => ({ success: options.rateAllowed !== false }) },
		CONTACT_EMAIL: { send: async (mail) => {
			if (options.emailFails) throw new Error('Simulated delivery failure');
			sent.push(mail);
			return { messageId: 'local-test' };
		} },
	};
	const verify = async (url, init) => {
		verificationCalls++;
		assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
		assert.equal(init.body.get('secret'), 'test-secret');
		assert.equal(init.body.get('remoteip'), '192.0.2.1');
		if (options.verifyThrows) throw new Error('Simulated network error');
		const token = init.body.get('response');
		const duplicate = tokens.has(token);
		tokens.add(token);
		return Response.json({ success: !duplicate, action: 'contact', hostname: 'holtsdav.com', ...options.verification }, { status: options.verifyStatus ?? 200 });
	};
	return { env, sent, verify, calls: () => verificationCalls };
}

test('valid message sends only to the owner with safe content and visitor Reply-To', async () => {
	const f = fixture();
	const response = await handleContact(request({ name: '<Visitor>', message: '<script>alert(1)</script>\nHello', to: 'attacker@example.com' }), f.env, f.verify);
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { success: true });
	assert.equal(f.sent.length, 1);
	assert.equal(f.sent[0].to, 'contact@holtsdav.com');
	assert.equal(f.sent[0].from.email, 'notifications@forms.holtsdav.com');
	assert.equal(f.sent[0].replyTo, 'visitor@example.com');
	assert.ok(!f.sent[0].html.includes('<script>'));
	assert.match(f.sent[0].html, /&lt;script&gt;/);
	assert.match(f.sent[0].text, /<script>/);
});

test('replayed verification token cannot trigger a second notification', async () => {
	const f = fixture();
	assert.equal((await handleContact(request(), f.env, f.verify)).status, 200);
	assert.equal((await handleContact(request(), f.env, f.verify)).status, 403);
	assert.equal(f.sent.length, 1);
});

for (const verification of [{ success: false }, { success: 'true' }, { action: 'login' }, { hostname: 'attacker.example' }]) {
	test(`rejects invalid verification ${JSON.stringify(verification)}`, async () => {
		const f = fixture({ verification });
		assert.equal((await handleContact(request(), f.env, f.verify)).status, 403);
		assert.equal(f.sent.length, 0);
	});
}

for (const fields of [{ name: ' ' }, { name: 'Name\r\nBcc: attacker@example.com' }, { email: 'invalid' }, { email: 'x@example.com\r\nBcc: y@example.com' }, { message: ' ' }, { message: 'x'.repeat(5001) }, { website: 'spam' }]) {
	test(`rejects invalid ${Object.keys(fields)[0]} before verification`, async () => {
		const f = fixture();
		assert.equal((await handleContact(request(fields), f.env, f.verify)).status, 400);
		assert.equal(f.calls(), 0);
		assert.equal(f.sent.length, 0);
	});
}

test('rejects cross-origin requests and missing tokens', async () => {
	const f = fixture();
	assert.equal((await handleContact(request({}, { Origin: 'https://attacker.example' }), f.env, f.verify)).status, 403);
	assert.equal((await handleContact(request({ token: '' }), f.env, f.verify)).status, 403);
	assert.equal(f.calls(), 0);
});

test('proxy hostname can differ while the verified frontend origin remains required', async () => {
	const f = fixture();
	const proxied = new Request('http://localhost:8787/api/contact', request());
	assert.equal((await handleContact(proxied, f.env, f.verify)).status, 200);
	assert.equal(f.sent.length, 1);
	assert.equal((await handleContact(request({}, { Origin: 'http://localhost:4321' }), f.env, f.verify)).status, 403);
});

test('rejects oversized bodies even without a Content-Length header', async () => {
	const f = fixture();
	assert.equal((await handleContact(request({ message: 'x'.repeat(33000) }), f.env, f.verify)).status, 413);
	assert.equal(f.calls(), 0);
});

test('rate limit returns a retry delay without sending or verifying', async () => {
	const f = fixture({ rateAllowed: false });
	const response = await handleContact(request(), f.env, f.verify);
	assert.equal(response.status, 429);
	assert.equal(response.headers.get('Retry-After'), '60');
	assert.equal(f.calls(), 0);
	assert.equal(f.sent.length, 0);
});

for (const failure of [{ emailFails: true }, { verifyThrows: true }, { verifyStatus: 500 }]) {
	test(`fails honestly when ${Object.keys(failure)[0]}`, async () => {
		const f = fixture(failure);
		const response = await handleContact(request(), f.env, f.verify);
		assert.equal(response.status, 503);
		assert.equal((await response.json()).success, undefined);
		assert.equal(f.sent.length, 0);
	});
}

test('public configuration never exposes secrets and fails closed before setup', async () => {
	const f = fixture();
	const get = () => new Request('https://holtsdav.com/api/contact');
	const response = await handleContact(get(), f.env, f.verify);
	assert.deepEqual(await response.json(), { siteKey: 'test-sitekey' });
	assert.equal(response.headers.get('Cache-Control'), 'no-store');
	f.env.TURNSTILE_SECRET = '';
	assert.equal((await handleContact(get(), f.env, f.verify)).status, 503);
	assert.equal((await handleContact(request(), f.env, f.verify)).status, 503);
	assert.equal(f.sent.length, 0);
});

test('rejects unsupported routes, methods, and malformed bodies', async () => {
	const f = fixture();
	assert.equal((await handleContact(new Request('https://holtsdav.com/api/contact-other'), f.env, f.verify)).status, 404);
	assert.equal((await handleContact(new Request('https://holtsdav.com/api/contact', { method: 'DELETE' }), f.env, f.verify)).status, 405);
	assert.equal((await handleContact(request({}, { 'Content-Type': 'text/plain' }), f.env, f.verify)).status, 415);
	assert.equal((await handleContact(new Request('https://holtsdav.com/api/contact', { method: 'POST', headers: { Origin: 'https://holtsdav.com', 'Content-Type': 'application/json' }, body: '{broken' }), f.env, f.verify)).status, 400);
	assert.equal(f.sent.length, 0);
});
