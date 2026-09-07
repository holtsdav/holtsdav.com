export {};

type Turnstile = {
	render: (container: HTMLElement, options: Record<string, unknown>) => string;
	reset: (widgetId: string) => void;
};

declare global {
	interface Window { turnstile?: Turnstile; }
}

async function initializeContactForm() {
	const form = document.querySelector<HTMLFormElement>('#contact-form');
	const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
	const buttonLabel = button?.querySelector('span');
	const status = document.querySelector<HTMLElement>('#contact-status');
	const verification = document.querySelector<HTMLElement>('#contact-verification');
	if (!form || !button || !buttonLabel || !status || !verification) return;
	let token = '';
	let widgetId: string | undefined;
	let sending = false;
	let sent = false;
	const setStatus = (message: string, state = '') => {
		status.textContent = message;
		status.dataset.state = state;
	};
	const resetVerification = () => {
		token = '';
		button.disabled = true;
		if (widgetId !== undefined) window.turnstile?.reset(widgetId);
	};
	form.addEventListener('input', (event) => {
		if (sent) { sent = false; setStatus(''); resetVerification(); }
		const input = event.target;
		if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
			input.removeAttribute('aria-invalid');
			const error = document.getElementById(`${input.name}-error`);
			if (error) error.textContent = '';
		}
	});
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		if (sending || sent || !form.reportValidity()) return;
		if (!token) { setStatus('Please complete the security check before sending.', 'error'); return; }
		sending = true;
		button.disabled = true;
		buttonLabel.textContent = 'Sending…';
		form.setAttribute('aria-busy', 'true');
		setStatus('Sending your message…');
		const fields = new FormData(form);
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: fields.get('name'), email: fields.get('email'), message: fields.get('message'), website: fields.get('website'), token }),
				signal: AbortSignal.timeout(30_000),
			});
			const result = await response.json();
			if (!response.ok || result.success !== true) {
				for (const name of ['name', 'email', 'message']) {
					const message = result.fields?.[name];
					if (typeof message === 'string') {
						form.querySelector(`[name="${name}"]`)?.setAttribute('aria-invalid', 'true');
						document.getElementById(`${name}-error`)!.textContent = message;
					}
				}
				throw new Error(typeof result.error === 'string' ? result.error : 'Your message could not be sent. Please try again or email me directly.');
			}
			form.reset();
			sent = true;
			setStatus('Thanks — your message has been sent.', 'success');
		} catch (error) {
			setStatus(error instanceof Error && !['TimeoutError', 'TypeError', 'SyntaxError'].includes(error.name) ? error.message : 'Could not confirm delivery. Your message is still here; please try again or email me directly.', 'error');
		} finally {
			sending = false;
			form.removeAttribute('aria-busy');
			buttonLabel.textContent = 'Send message';
			resetVerification();
			status.focus({ preventScroll: true });
		}
	});

	try {
		setStatus('Loading the security check…');
		const response = await fetch('/api/contact', { signal: AbortSignal.timeout(10_000) });
		if (!response.ok) throw new Error('Unavailable');
		const config = await response.json();
		if (typeof config.siteKey !== 'string' || !config.siteKey) throw new Error('Unavailable');
		await new Promise<void>((resolve, reject) => {
			if (window.turnstile) { resolve(); return; }
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			const timer = window.setTimeout(() => reject(new Error('Verification unavailable')), 15_000);
			script.onload = () => { window.clearTimeout(timer); resolve(); };
			script.onerror = () => { window.clearTimeout(timer); reject(new Error('Verification unavailable')); };
			document.head.append(script);
		});
		if (!window.turnstile) throw new Error('Unavailable');
		widgetId = window.turnstile.render(verification, {
			sitekey: config.siteKey, action: 'contact', theme: 'dark', size: 'flexible',
			callback: (value: string) => {
				token = value;
				button.disabled = sending || sent;
				if (!sending && !sent && status.dataset.state !== 'error') setStatus('');
			},
			'expired-callback': () => { if (!sending) resetVerification(); },
			'error-callback': () => {
				token = '';
				button.disabled = true;
				if (!sent) setStatus('The security check could not load. Please reload this page or email me directly.', 'error');
			},
		});
	} catch {
		setStatus('The form is unavailable right now. Please email contact@holtsdav.com instead.', 'error');
	}
}

void initializeContactForm();
