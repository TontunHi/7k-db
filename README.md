<div align="center">

# 🗡️ 7k-db

### The Ultimate Seven Knights Database & Admin Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-Premium-FFD700?style=for-the-badge&logo=lucide)](https://lucide.dev/)

**7k-db** is a production-grade web application designed to manage and display complex game data for Seven Knights. It features a powerful, secure Admin Dashboard and a high-performance frontend for players.

</div>

---

## ✨ Key Features

- 🛡️ **Advanced Admin Dashboard**: Secure management of heroes, pets, and skills.
- 🧪 **Build Manager**: Create and share hero builds with detailed stat breakdowns.
- 🏆 **Tierlist System**: Fully customizable tierlists with dynamic ranking logic.
- ⚔️ **Content Guides**: Specialized sections for Arena, Raids, Guild War, and Total War.
- 🚀 **Manual Migrations**: Robust database versioning and schema management.
- ⚡ **Optimized Performance**: Next.js 15+ standalone mode with Turbopack support.

---

## 🛠️ Tech Stack

- **Core**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/Logic**: [React Hooks](https://reactjs.org/) & [Lucide React](https://lucide.dev/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Backend Logic**: [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## 🚀 Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=7k-db
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_long_random_string
```

### 3. Database Setup

Initialize your database schema:

```bash
node scripts/migrate.mjs
```

### 4. Development

Run the development server:

```bash
npm run dev
```

---

## 📦 Deployment

This project is optimized for manual deployment (No GitHub Actions required).

1. **Build**: `npm run build`
2. **Start**: `npm start`

> [!TIP]
> For production hosting, we recommend using **PM2** to manage your node process.
>
> ```bash
> pm2 start npm --name "7k-db" -- start
> ```

---

## 📄 License

Custom License - All Rights Reserved.
