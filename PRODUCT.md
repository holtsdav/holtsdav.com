# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: recruiters evaluating David Holtschke's software development work.
- Secondary: people discovering and downloading his apps and games.
- Secondary: potential collaborators exploring his projects and finding a way to contact him.

## Product Purpose

holtsdav.com is David Holtschke's developer portfolio. Its primary purpose is to showcase his work so recruiters can assess it. A successful visit helps a recruiter understand his projects and reach his professional profile or contact details. Other successful visits lead people to an available app or game, its support information, or a collaboration conversation.

## Operating Context

Visitors browse the portfolio and individual project pages, inspect project previews, and follow links to the App Store, itch.io, GitHub, LinkedIn, or email. The site also hosts website and app privacy information and an imprint.

## Capabilities and Constraints

- Keep the site statically buildable with the existing Astro, TypeScript, Tailwind CSS 4, custom CSS, and Three.js stack, using npm and the Node.js version in `.nvmrc`.
- Deployment target: static Cloudflare Pages.
- Do not add a frontend framework, backend, database, CMS, or server-side rendering without an explicit request.
- English is the intended website language, as confirmed by the owner. Existing localized privacy documents are separate content to preserve.
- Project pages and outbound destinations must accurately distinguish available projects, projects in development, and planned work. Repository copy is evidence of current presentation, not independent verification of release status or product claims.
- Open decisions: final biography, recruiter-facing background and project contribution details, and the scope of future projects such as NotiLog.

## Brand Commitments

Use the existing names David Holtschke and holtsdav. Preserve project names and real identity assets. No additional voice or visual direction was established during initialization.

## Evidence on Hand

- `src/pages/index.astro`: portfolio entries, project destinations, and contact links. The biography and portrait area are explicitly placeholders.
- `src/pages/apps/glassdays-countdown.astro`: existing Glassdays Countdown feature copy and App Store destination.
- `src/pages/apps/mute-on-location.astro`: existing Mute On Location feature copy and development status.
- `src/pages/apps/rogue-color.astro`: existing Rogue Color description, game-jam background, and itch.io/GitHub destinations.
- `src/pages/NotiLog.astro`: a future-project placeholder; it does not establish a finished product.
- `public/`: existing logo, app icons, Glassdays and Mute On Location previews, and Rogue Color gameplay image.
- `src/pages/apps/`: existing app privacy documents, including localized Glassdays documents.
- `src/components/SocialLinks.astro`: existing professional and social profile destinations.

Do not turn placeholder content into biographical facts or invent employment history, project outcomes, testimonials, usage metrics, or release claims. Confirm material factual additions with the owner.

## Product Principles

1. Prioritize helping recruiters assess David's actual work.
2. Ground project descriptions in real capabilities and available evidence.
3. Keep app discovery, support information, and contact paths useful for secondary audiences.
4. Clearly distinguish shipped work from development and planned projects.
5. Preserve a straightforward static site as the portfolio grows.
