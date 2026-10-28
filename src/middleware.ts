import { defineMiddleware } from 'astro:middleware';

// Keep development and built previews consistent so project and privacy links
// can be reviewed locally. No production services are needed to view the site.
export const onRequest = defineMiddleware((_context, next) => next());
