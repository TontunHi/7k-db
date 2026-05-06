# 🛡️ 7K-DB: Seven Knights Rebirth Database

7K-DB คือแพลตฟอร์มฐานข้อมูลและเครื่องมือวางแผนกลยุทธ์สำหรับเกม **Seven Knights Rebirth** ที่ถูกออกแบบมาเพื่อความรวดเร็ว แม่นยำ และใช้งานง่าย พัฒนาด้วยเทคโนโลยีเว็บยุคใหม่เพื่อรองรับข้อมูลเกมที่มีการอัปเดตตลอดเวลา

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

---

## 🎮 Public Experience (ฟีเจอร์สำหรับผู้ใช้งาน)

ฐานข้อมูลที่ครบวงจรเพื่อให้ผู้เล่นสามารถเข้าถึงข้อมูลเชิงลึกได้ทันที:

- **Hero Database & Builds:** ข้อมูล Hero ครบถ้วนพร้อมระบบแนะนำการใส่อุปกรณ์และอัปเกรดสกิล
- **Strategy Guides:** คู่มือการผ่านด่าน PVE (Raid, Dungeon, Castle Rush, Advent Expedition)
- **Competitive Meta:** ติดตาม Meta การจัดทีมสำหรับ Arena, Guild War และ Total War
- **Tactical Tools:** 
  - **Build Simulator:** จำลองการใส่อุปกรณ์และคำนวณ Stats
  - **Tierlist Maker:** เครื่องมือสร้างตารางจัดอันดับ Hero ส่วนตัว
  - **Hero Stats Builder:** วางแผนการอัปเกรดตัวละครล่วงหน้า

---

## 🛡️ Strategic Command (ฟีเจอร์สำหรับผู้ดูแลระบบ)

ระบบหลังบ้านดีไซน์ใหม่ที่เน้นความสบายตาและประสิทธิภาพการทำงาน (Admin Dashboard):

- **Modern Dashboard:** หน้าสรุปผลแบบ Minimalist ติดตามสถิติ **Views Today** และ **Unique Users** แบบ Real-time
- **Content Logistics:** จัดการข้อมูล Hero, Build, และด่านต่างๆ ผ่าน Interface ที่ใช้งานง่าย
- **Asset Management:** ระบบอัปโหลดและจัดการรูปภาพ Hero/Items พร้อมระบบความปลอดภัยในการตรวจสอบไฟล์
- **Admin Logs:** ระบบตรวจสอบประวัติการทำงานของผู้ดูแลระบบ (Who did what, and when)
- **User Permissions:** ควบคุมสิทธิ์การเข้าถึงเมนูต่างๆ ตามบทบาท (Role-based Access Control)

---

### 🛠️ Tech Stack (เทคโนโลยีที่ใช้)

| ส่วนงาน | เทคโนโลยี |
| --- | --- |
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS 4, CSS Modules (Component-level) |
| **Database** | MySQL 8.0+ (mysql2) |
| **Testing** | Vitest (Unit & Integration Testing) |
| **Auth** | Secure HMAC Session Cookies |
| **Icons** | Editorial Design System (Custom Markers & Labels) |

---

## 🚀 Getting Started (การเริ่มต้นใช้งาน)

### 1. Requirements
- Node.js (Compatible with Next.js 16)
- MySQL 8+
- npm / pnpm

### 2. Environment Setup
สร้างไฟล์ `.env` ไว้ที่ Root ของโปรเจกต์:

```env
# Database Configuration
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=7k-db

# Security
SESSION_SECRET=your_long_random_secret
ANALYTICS_SALT=your_analytics_salt

# Initial Admin Setup
ADMIN_USER=admin_username
ADMIN_PASSWORD=admin_password
```

### 3. Installation & Deployment
```bash
# ติดตั้ง Dependencies
npm install

# รันระบบ Database Migration
node scripts/migrate.mjs

# ซิงค์ข้อมูลบัญชี Admin
node scripts/sync-admin.mjs

# เริ่มรันระบบในโหมดพัฒนา
npm run dev
```

---

## 🔒 Security & Integrity

- **Data Safety:** ระบบมีการใช้การตรวจสอบสิทธิ์ในระดับ Server-side ทุกจุด เพื่อป้องกันการเข้าถึงหน้า Admin โดยไม่ได้รับอนุญาต
- **Input Validation:** ใช้ TypeScript ในการตรวจสอบข้อมูลที่รับเข้าสู่ระบบทั้งหมด
- **Privacy:** ระบบ Analytics ถูกออกแบบมาเพื่อเก็บสถิติการใช้งานโดยไม่ระบุตัวตน (Anonymous Tracking)
- **Hardened Uploads:** การอัปโหลดไฟล์มีการจำกัดนามสกุล ขนาด และตรวจเช็คเส้นทางไฟล์เพื่อป้องกันการโจมตีผ่านไฟล์รูปภาพ

---

## 📂 Project Structure

```text
src/
  app/         # Routing, API, และ Layouts
  components/  # UI Components (แยกส่วน Public และ Admin)
  lib/         # Server Actions, Database Access, และ Auth
  hooks/       # Custom React Hooks
public/        # แหล่งเก็บ Assets (Heroes, Skills, Items)
scripts/       # Scripts สำหรับดูแลระบบ Database และ Registry
```

---

**License:** Custom License - All Rights Reserved.  
*พัฒนาด้วยความใส่ใจเพื่อชุมชน Seven Knights Rebirth*
