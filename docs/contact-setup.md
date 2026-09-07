# Contact form

The Astro contact page offers a direct `mailto:contact@holtsdav.com` link and a form. A Cloudflare Worker handles `/api/contact` and sends notifications only to the verified **contact@holtsdav.com** inbox. The sender is **notifications@forms.holtsdav.com**; the visitor's email is Reply-To. This sender is technical infrastructure, not a new mailbox or login.

## Cloudflare configuration

- Account: `f81e2bb6f063f8462a0ae79eca8ef8f8`.
- Worker: `holtsdav-contact`, deployed on `holtsdav.com/api/contact*` and `www.holtsdav.com/api/contact*`.
- Email Routing is enabled only for `forms.holtsdav.com`. The apex domain's existing iCloud MX records remain unchanged. Do not enable routing on `holtsdav.com` or replace its iCloud mail records.
- Destination `contact@holtsdav.com` is verified.
- Managed Turnstile widget: `holtsdav contact`, public key in `workers/contact/wrangler.jsonc`, pre-clearance disabled. Widget accepts production domains and localhost; the production Worker accepts only the production origins and verifies the exact frontend hostname and `contact` action.
- `TURNSTILE_SECRET` is stored as a Worker secret, and in the ignored, user-only `workers/contact/.dev.vars` for local development. Never commit or print it.

Sending to verified destinations is free on Workers Free. No paid plan was enabled. Worker requests remain subject to the Free plan's limits; Turnstile uses its Free plan.

Sources checked September 7, 2026:

- https://developers.cloudflare.com/email-service/platform/pricing/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/email-service/configuration/subdomains/
- https://developers.cloudflare.com/workers/platform/pricing/

## Local development

Use Node 24 from `.nvmrc` and the authenticated Wrangler installation.

```sh
npm run dev
```

Astro’s development plugin starts Wrangler on port 8787 and waits for the API before serving pages on port 4321. Astro proxies `/api/contact` to Wrangler. The plugin stops the Worker when the dev server closes. The local ignored `.dev.vars` overrides `ALLOWED_ORIGINS` to `http://localhost:4321,http://127.0.0.1:4321`; those origins are not permitted by the production Worker.

The email binding uses `remote: true`: **local form submissions send real notifications** to the fixed owner inbox. Turnstile verification is real too. Keep Wrangler authenticated. Running `astro dev` directly also loads the plugin; do not start a second Worker on port 8787. Other machines need their own ignored `.dev.vars` containing the widget secret and the local origins above.

## Validation and deployment

```sh
npm run check
npm run test:contact
npm run build
npm run contact:deploy
```

Worker deployment retains the existing secret. It does not publish the Astro pages: publish the site through its existing Cloudflare Pages workflow when the current site changes are ready.

The backend was deployed and its public configuration endpoint verified. A real local browser submission passed Turnstile and Cloudflare's remote email binding returned success; the page cleared the fields and showed its sent confirmation. The owner confirmed that “Website contact: Website delivery test” arrived at contact@holtsdav.com on September 7, 2026. The static production contact page has not yet been published.

The server validates fields and Origin, checks a fresh single-use Turnstile token, enforces a per-IP limit of five attempts per minute, and caps bodies at 32 KiB. It never logs submitted messages, addresses, or secrets. Failed delivery preserves the visitor's message. Automated tests cover failure cases, recipient restriction, escaped content, and replay rejection.
