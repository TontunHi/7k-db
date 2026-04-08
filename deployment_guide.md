# 7k-db Manual Deployment Guide

Since GitHub Actions has been removed, you can now manage your deployments manually using the commands below.

## Prerequisites
Ensure your `.env` file is set up correctly with:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

---

## Step 1: Database Migration
Whenever you update the code or change the database structure, run the migration script:
```bash
node scripts/migrate.mjs
```

## Step 2: Build the Project
To prepare the application for production, generate the optimized build:
```bash
npm run build
```

## Step 3: Start the Production Server
Once the build is complete, you can start the server:
```bash
npm start
```

---

## 🔒 Security Best Practices

### 1. Protect your Admin Credentials
Instead of storing your plain-text password in `.env`, you can store its **Bcrypt Hash**. You can also customize your admin username.

**Environment Configuration (.env):**
```env
ADMIN_USER=your_custom_admin_name
ADMIN_PASSWORD=$2b$12$YourGeneratedHashPointsHere...
```

**How to generate a hash:**
```bash
node scripts/hash.mjs your_password_here
```

**How to update your database with new credentials:**
If you change your `ADMIN_USER` or `ADMIN_PASSWORD` in `.env` after the initial setup, run this script to sync them to the database:
```bash
node scripts/sync-admin.mjs
```

### 2. Session Security
Always ensure your `SESSION_SECRET` is a long, random string (e.g., 32+ characters).

---

## Tips for Simple Hosting
- **If using a VPS (Ubuntu/Debian)**: Use `pm2` to keep the app running in the background.
  ```bash
  pm2 start npm --name "7k-db" -- start
  ```
- **Local Development**: You can still use `npm run dev` for testing changes before building them.

> [!NOTE]
> If you ever want to re-enable automation, we can always recreate a simpler workflow or use a different tool!
