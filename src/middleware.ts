import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
	if (import.meta.env.DEV) {
		// Keep both current and legacy privacy URLs available in the stripped dev site.
		const privacyPage = /^\/(?:privacy(?:\/|$)|apps\/[^/]+\/privacy(?:\/|$))/.test(url.pathname);
		const portfolioPage = /^\/(?:project(?:\/|$)|apps(?:\/|$)|(?:contact|Glassdays|MuteOnLocation|NotiLog|RogueColor)\/?$)/.test(url.pathname);
		if (portfolioPage && !privacyPage) return redirect('/', 302);
	}

	return next();
});
