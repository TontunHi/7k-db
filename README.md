# 7k-db

Seven Knights Rebirth database, strategy guide, and admin dashboard built with
Next.js App Router.

## Features

- Admin dashboard for game content, users, permissions, assets, and credits
- Hero builds, tier lists, stages, raids, dungeons, castle rush, advent, arena,
  guild war, and total war content
- Public tools for tier list creation and build/stat simulation
- MySQL-backed data model with manual migration scripts
- Asset registry for heroes, pets, skills, items, and guide images

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- MySQL via `mysql2`
- Server Actions and App Router route handlers
- Vitest for focused unit tests

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=7k-db
SESSION_SECRET=replace_with_a_long_random_secret
ADMIN_USER=admin
ADMIN_PASSWORD=replace_with_a_strong_password_or_bcrypt_hash
ANALYTICS_SALT=replace_with_a_long_random_salt
```

Run migrations:

```bash
node scripts/migrate.mjs
```

Start development:

```bash
npm run dev
```

## Scripts

```bash
npm run lint
npm test
npm run build
node scripts/migrate.mjs
node scripts/sync-admin.mjs
node scripts/sync-registry.mjs
```

## Deployment Notes

Build and start the production server:

```bash
npm run build
npm start
```

Use a process manager such as PM2 on a server deployment:

```bash
pm2 start npm --name "7k-db" -- start
```

Uploads are written under `public/` by the asset API. Make sure the production
process has write permission for the allowed asset folders if asset management is
enabled.

## License

Custom License - All Rights Reserved.
