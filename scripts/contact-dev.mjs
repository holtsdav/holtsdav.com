import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

/** @returns {import('vite').Plugin} */
export function contactDev() {
	let worker;
	return {
		name: 'contact-api-dev',
		apply: 'serve',
		async configureServer(server) {
			worker = spawn('node_modules/.bin/wrangler', ['dev', '--config', 'workers/contact/wrangler.jsonc', '--port', '8787'], { stdio: 'inherit' });
			let failed = false;
			worker.on('error', () => { failed = true; });
			worker.on('exit', () => { failed = true; });
			server.httpServer?.once('close', () => worker?.kill('SIGTERM'));
			// Wait for the API so the first page load can use it.
			for (let attempt = 0; attempt < 60 && !failed; attempt++) {
				try {
					const response = await fetch('http://127.0.0.1:8787/api/contact', { signal: AbortSignal.timeout(1000) });
					if (response.ok) return;
				} catch { /* Wrangler is still starting. */ }
				await setTimeout(500);
			}
			worker.kill('SIGTERM');
			server.config.logger.warn('Contact API unavailable. Check workers/contact/.dev.vars and Wrangler authentication.');
		},
		closeBundle() { worker?.kill('SIGTERM'); },
	};
}
