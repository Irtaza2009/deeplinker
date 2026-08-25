# deeplinker

A self-hosted deep-link generator for your Instagram bio, with a private
analytics dashboard.

Instead of placing a raw destination URL in your bio, use a deeplinker URL
such as `yourdomain.com/l/some-slug`. When someone opens it in an in-app
browser, deeplinker attempts to open the destination in the native app or
the visitor's actual browser. It always shows a visible **Continue** button
as a fallback.

Each public link open is logged with a timestamp, coarse operating system,
browser, device type, and referrer domain. No IP addresses, cookies, or
fingerprinting are used for visitor analytics.

## How redirects work

- **Android:** deeplinker builds an `intent://` URL. Android in-app browsers
  commonly hand this to Chrome or the matching native app. A browser fallback
  URL is included when no matching app is installed.
- **iOS:** deeplinker tries the destination app's custom URL scheme first,
  then attempts the `x-safari-` escape technique.
- **All platforms:** a manual **Continue** button appears after about 1.2
  seconds, so a visitor is never stranded if an automatic redirect fails.

Automatic iOS escape behavior is not guaranteed. Apple, Meta, and in-app
browser vendors can change these behaviors at any time.

## Stack

- Next.js 16 with the App Router
- React 19
- Plain CSS
- Upstash Redis for links and analytics
- Vercel-compatible deployment

## Local setup

Star this repo and then fork it!

Install dependencies:

```powershell
npm install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env.local
```

Generate a secure session secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Open `.env.local` and set:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `DASHBOARD_PASSWORD`
- `SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

For local development, leave `NEXT_PUBLIC_SITE_URL` as:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the app:

```powershell
npm run dev
```

Then open `http://localhost:3000`. You will be redirected to `/login`.

## Redis setup

Create an Upstash Redis database, then copy its REST URL and REST token into
`.env.local`.

The application stores data with these keys:

- `links:index` — set of all slugs
- `link:<slug>` — link record
- `link:<slug>:count` — total opens
- `link:<slug>:stats` — OS, browser, device, and referrer counts
- `link:<slug>:daily` — daily open counts
- `link:<slug>:events` — most recent 200 raw events

The dashboard displays the latest 50 events.

## Deploying

Deploy the repository to Vercel or another Next.js-compatible host.

Set the same five environment variables in the deployment environment. Change
`NEXT_PUBLIC_SITE_URL` to the real production URL, for example:

```env
NEXT_PUBLIC_SITE_URL=https://links.irtaza.xyz
```

After deployment, add a custom domain if you want a shorter, more trustworthy
link for your social-media bio.

## Using the app

1. Visit the deployed site and log in.
2. Enter a full destination URL beginning with `https://` or `http://`.
3. Optionally choose a label, visitor-facing description, and custom slug.
4. Generate the link.
5. Put the resulting `/l/<slug>` URL in your bio.
6. Use `/dashboard` to inspect opens, platforms, browsers, referrers, and
   recent activity.

## Privacy

deeplinker does not store visitor IP addresses, set analytics cookies, or
fingerprint users. It records only:

- timestamp
- coarse OS
- browser or in-app browser
- device category
- referrer domain

## Credits

Made with love by Irtaza (me)! Please star the repo!
