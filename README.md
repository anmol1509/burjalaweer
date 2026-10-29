# Burj Al Aweer website

Seven-page Next.js App Router website for Burj Al Aweer Group of Companies. TypeScript, Tailwind CSS, locally hosted Manrope/Inter via next/font, Motion, Lucide, React Hook Form and Zod.

## Development

Node.js 24 is verified. From `/workspace/burjalaweer`:

```sh
npm ci
npm run dev
```

Use the existing checkout; cloud tasks are isolated and do not need an additional worktree. For production: `npm run build` then `npm start`. Live server processes must restart after snapshot restoration.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm start
# In another terminal:
npm test
```

Browser tests use `/usr/bin/chromium` in this environment. Adjust `playwright.config.ts` to your local browser installation. Tests cover all routes, five viewport widths, keyboard tabs, mobile navigation, form validation, unavailable email delivery, origin protection, honeypot and rate limiting. Unconfigured delivery tests expect email credentials to be absent.

## Email integration

Copy `.env.example` to `.env.local` locally, or set variables securely in Vercel settings. Never commit credentials.

- `RESEND_API_KEY`: server-only Resend API key with sending permission.
- `ENQUIRY_FROM_EMAIL`: a sender on a verified Resend domain, e.g. `Burj Al Aweer <enquiries@your-verified-domain>`.
- `NEXT_PUBLIC_SITE_URL`: canonical production origin; defaults to `https://www.burjalaweer.com`.

All enquiries are addressed to `info@burjalaweer.com`; the enquirer's email is used for replies. No successful delivery message is shown unless Resend accepts the request. Provider acceptance does not guarantee inbox arrival. Without credentials the API returns 503 with direct contact options. No enquiry payloads or provider credentials are logged. The honeypot, request-size cap, server validation, same-origin restriction and five-requests-per-ten-minutes process-local rate limiter provide basic protection. Before a high-traffic public launch use a shared durable limiter (e.g. Vercel Firewall) because serverless replicas do not share process memory.

## Assets and launch requirements

- `public/company-profile.pdf` is the supplied original. Company logo, client logos and the hero photograph were extracted from it. Business copy follows that profile. Client logos are low-resolution source assets, not recreated wordmarks.
- The high-resolution attached PNG logo was visible in chat but not supplied as a readable cloud file. Replace `public/images/logo.png` with that original before launch.
- The PDF hero is only 396×224 pixels and is a temporary source asset. It needs a licensed high-resolution replacement.
- `public/images/{construction,infrastructure,industrial,carpentry,steel,masonry,team,planning}.svg` are deliberate architectural placeholders. They are not photographs of company projects. Replace them with licensed, subject-appropriate photography and update the `Photo` asset extension mapping in `components/site.tsx`. Do not launch as a final photography-complete design.
- Photography downloads from `images.unsplash.com` were blocked with HTTP 403. Network domain additions were saved to the environment draft; saving did not activate runtime access.
- No unverified certifications, testimonials, extra industries, office addresses or social accounts were added.

## Vercel

1. Push this branch to the GitHub repository and create/review a pull request.
2. Import the repository into Vercel, use Next.js preset and the repository root, and select Node 24.x.
3. Set the three variables above in the appropriate deployment environments. Verify the sending domain with Resend.
4. Deploy, verify all seven pages, submit a real enquiry and confirm receipt at the company inbox.
5. Set the final canonical origin before production. Domain connection and DNS changes require separate approval.

No deployment or DNS change has been performed. No live URL is claimed. Production build readiness is separate from outstanding photography and email configuration.
