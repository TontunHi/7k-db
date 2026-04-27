<div align="center">

# 7k-db

Seven Knights Rebirth database, strategy guide, tooling suite, and admin
dashboard built with Next.js App Router.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

## Overview

`7k-db` is a production-focused web application for managing and publishing
Seven Knights Rebirth data. It combines a public-facing guide site with an
admin dashboard for content operations, asset management, analytics, and user
permissions.

The app is designed for fast iteration on game content while keeping admin-only
workflows protected behind signed sessions and role-based permissions.

## Highlights

- Public database and strategy pages for heroes, builds, tier lists, stages,
  raids, dungeons, castle rush, advent expedition, arena, guild war, and total war
- Admin dashboard for content management, user management, permissions, credits,
  analytics, registry data, and asset uploads
- Public tools for tier list creation, hero stat planning, and build simulation
- MySQL-backed persistence with manual migration and synchronization scripts
- Hardened asset upload path with file type, extension, size, path, and overwrite
  protection
- Focused unit tests for session token behavior and asset validation

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, Tailwind CSS 4, CSS Modules |
| Icons and UX | Lucide React, Sonner, next-themes |
| Data | MySQL, mysql2 |
| Auth | Signed HMAC session cookies, admin permissions |
| Testing | Vitest |
| Tooling | ESLint, npm scripts |

## Project Structure

```text
src/
  app/                  App Router pages, layouts, API routes, metadata
  components/           Public UI, admin UI, tools, layouts, shared components
  lib/                  Server actions, database access, auth, validation helpers
public/
  heroes/               Hero images
  skills/               Skill images
  items/                Equipment and item images
  ...                   Guide and mode-specific assets
scripts/
  migrate.mjs           Database schema migration
  sync-admin.mjs        Admin account synchronization
  sync-registry.mjs     Asset registry synchronization
```

## Requirements

- Node.js compatible with Next.js 16
- npm
- MySQL 8 or compatible provider
- Write access to `public/` asset folders if the asset manager is enabled in
  production

## Environment

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=7k-db
DB_SSL=false

SESSION_SECRET=replace_with_a_long_random_secret
ADMIN_USER=admin
ADMIN_PASSWORD=replace_with_a_strong_password_or_bcrypt_hash
ANALYTICS_SALT=replace_with_a_long_random_salt
```

For production, use strong random values for `SESSION_SECRET` and
`ANALYTICS_SALT`. If the database provider requires TLS, set `DB_SSL=true`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
node scripts/migrate.mjs
```

Create or update the admin account from `.env`:

```bash
node scripts/sync-admin.mjs
```

Start the development server:

```bash
npm run dev
```

By default, Next.js serves the app at:

```text
http://localhost:3000
```

## Common Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `node scripts/migrate.mjs` | Apply database migrations |
| `node scripts/sync-admin.mjs` | Sync the admin account from environment values |
| `node scripts/sync-registry.mjs` | Sync public assets into registry data |
| `node scripts/hash.mjs <password>` | Generate a bcrypt hash for admin password setup |

## Security Notes

- Admin pages are protected by signed session cookies.
- Session tokens include issued-at and expiry timestamps.
- Asset API access requires the `MANAGE_ASSETS` permission or super admin role.
- Asset uploads are limited to supported image formats and size-capped.
- Local database artifacts such as `*.sqlite` and `*.db` are ignored by git.

## Production Deployment

Build the app:

```bash
npm run build
```

Start the app:

```bash
npm start
```

For a server deployment, run the app behind a process manager:

```bash
pm2 start npm --name "7k-db" -- start
```

Before deploying, confirm:

- `.env` contains production database credentials
- `SESSION_SECRET` and `ANALYTICS_SALT` are strong random values
- migrations have been applied
- the runtime user can write to allowed `public/` asset folders if uploads are used

## Verification

Recommended checks before pushing or deploying:

```bash
npm run lint
npm test
npm run build
```

## License

Custom License - All Rights Reserved.
