const RECIPIENT = 'contact@holtsdav.com';
const SENDER = 'notifications@forms.holtsdav.com';
const MAX_BODY_BYTES = 32_768;
const UNAVAILABLE = 'The form is unavailable right now. Please email contact@holtsdav.com instead.';

function json(body: Record<string, unknown>, status = 200) {
	return Response.json(body, {
		status,
		headers: {
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
			...(status === 429 ? { 'Retry-After': '60' } : {}),
			...(status === 405 ? { Allow: 'GET, POST' } : {}),
		},
	});
}

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (character) => {
		return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!;
	});
}

async function readBody(request: Request): Promise<unknown> {
	if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) throw new RangeError('Request too large');
	const reader = request.body?.getReader();
	if (!reader) return null;
	const decoder = new TextDecoder();
	let text = '';
	let bytes = 0;
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			bytes += value.byteLength;
			if (bytes > MAX_BODY_BYTES) {
				await reader.cancel();
				throw new RangeError('Request too large');
			}
			text += decoder.decode(value, { stream: true });
		}
		return JSON.parse(text + decoder.decode());
	} finally {
		reader.releaseLock();
	}
}

export async function handleContact(request: Request, env: ContactEnv, verifyFetch: typeof fetch = fetch): Promise<Response> {
	const url = new URL(request.url);
	if (url.pathname !== '/api/contact' && url.pathname !== '/api/contact/') return json({ error: 'Not found.' }, 404);
	if (request.method !== 'GET' && request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
	if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET || !env.CONTACT_EMAIL || !env.CONTACT_RATE_LIMIT) return json({ error: UNAVAILABLE }, 503);
	if (request.method === 'GET') return json({ siteKey: env.TURNSTILE_SITE_KEY });
	const origin = request.headers.get('Origin');
	const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim());
	// Validate the actual frontend origin; the local Vite proxy uses a different API port.
	if (!origin || !allowedOrigins.includes(origin)) return json({ error: 'Please send your message from the contact page.' }, 403);
	if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'Unsupported message format.' }, 415);
	let body: unknown;
	try {
		body = await readBody(request);
	} catch (error) {
		return json({ error: error instanceof RangeError ? 'Your message is too long.' : 'Please check your message and try again.' }, error instanceof RangeError ? 413 : 400);
	}
	if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Please check your message and try again.' }, 400);
	const fields = body as Record<string, unknown>;
	if (typeof fields.website === 'string' && fields.website.length > 0) return json({ error: 'Please send your message from the contact page.' }, 400);
	const name = typeof fields.name === 'string' ? fields.name.trim() : '';
	const email = typeof fields.email === 'string' ? fields.email.trim() : '';
	const message = typeof fields.message === 'string' ? fields.message.trim() : '';
	const token = fields.token;
	const errors: Record<string, string> = {};
	if (!name || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name)) errors.name = 'Enter your name (up to 80 characters).';
	if (email.length > 254 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(email)) errors.email = 'Enter a valid email address.';
	if (!message || message.length > 5000) errors.message = 'Enter a message (up to 5,000 characters).';
	if (Object.keys(errors).length > 0) return json({ error: 'Please check the highlighted fields.', fields: errors }, 400);
	if (typeof token !== 'string' || !token || token.length > 2048) return json({ error: 'Please complete the security check and try again.' }, 403);
	try {
		const ip = request.headers.get('CF-Connecting-IP');
		const limit = await env.CONTACT_RATE_LIMIT.limit({ key: ip ?? 'unknown' });
		if (!limit.success) return json({ error: 'Please wait a minute before sending another message.' }, 429);
		const verification = await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, ...(ip ? { remoteip: ip } : {}) }),
			signal: AbortSignal.timeout(10_000),
		});
		if (!verification.ok) return json({ error: 'The security check is unavailable. Please try again.' }, 503);
		const result = await verification.json() as { success?: boolean; action?: string; hostname?: string } | null;
		if (result?.success !== true || result.action !== 'contact' || result.hostname !== new URL(origin).hostname) return json({ error: 'The security check expired or failed. Please try again.' }, 403);
		// Fixed recipient and sender prevent sending to visitors or arbitrary addresses.
		await env.CONTACT_EMAIL.send({
			to: RECIPIENT,
			from: { email: SENDER, name: 'holtsdav website' },
			replyTo: email,
			subject: `Website contact: ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
			html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>`,
		});
		return json({ success: true });
	} catch {
		// Never log submitted content, addresses, tokens, or provider error payloads.
		console.error(JSON.stringify({ event: 'contact_delivery_failed' }));
		return json({ error: 'Your message could not be sent. Please try again or email contact@holtsdav.com.' }, 503);
	}
}

export default {
	fetch(request, env) { return handleContact(request, env); },
} satisfies ExportedHandler<ContactEnv>;
