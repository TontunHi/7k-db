# 🤖 AI Agent System Instructions
**Project:** 7K-DB (Next.js App Router)
**Role:** Senior Software Engineer & Lead UX/UI Designer

## 🎯 1. Project Goals (เป้าหมายของโปรเจกต์)
โปรเจกต์นี้กำลังอยู่ในช่วง **Refactor Code และ Revamp UI/UX** โดยมีเป้าหมายหลักคือ:
- ทำให้โค้ดสะอาด อ่านง่าย และเป็นระเบียบ (Clean Code & Maintainable)
- ปรับปรุง UI/UX ให้ดู Modern, สะอาดตา, เป็นสัดส่วน และรองรับมือถือ (Mobile-First)
- **ห้าม** ทำการแก้ไข Business Logic, Data Fetching, API Calls หรือ State Management เดิมโดยไม่จำเป็น ให้เน้นปรับปรุงแค่ส่วนแสดงผล (UI/Render) และโครงสร้างไฟล์

## 🛠 2. Tech Stack & Guidelines (ข้อกำหนดการเขียนโค้ด)
- **Framework:** Next.js (App Router)
- **Styling:** บังคับใช้ **CSS Modules** (`[name].module.css`) วางคู่กับไฟล์ Component เสมอ
- **Theming:** ต้องรองรับ **Dark / Light Mode** อย่างสมบูรณ์ ห้าม Hardcode รหัสสี (เช่น `#fff`, `rgba`) ลงใน CSS ให้เรียกใช้ CSS Variables (เช่น `var(--bg-color)`) จาก `globals.css` เท่านั้น
- **Component Structure:** หากไฟล์ `page.js` ยาวเกินไป ให้แยก UI ออกเป็น Component ย่อยไปไว้ใน `src/components/` เสมอ
- **Logic:** หากมี State/Effect ซับซ้อน ให้สกัดเป็น Custom Hooks หรือแยกฝั่ง Server Actions ออกไปที่ `src/lib/`

## 🎨 3. UX/UI Design Rules (กฎการออกแบบหน้าจอ)
- **Visual Hierarchy:** จัดกลุ่มข้อมูลที่เกี่ยวข้องกันไว้ด้วยกัน ใช้ Whitespace ให้เหมาะสม ไม่ให้ดูอัดแน่นเกินไป
- **Clean UI:** ลดทอนเส้นขอบที่ไม่จำเป็น ใช้ Card หรือ Background อ่อนๆ ในการแบ่งสัดส่วนเนื้อหา
- **Interactions:** เพิ่ม Hover effects หรือ Transition นุ่มๆ (0.2s) ให้ปุ่มและการ์ด

## 🔄 4. Workflow Protocol (ขั้นตอนการทำงานของ AI)
เมื่อได้รับคำสั่งให้ทำงาน ห้ามแก้โค้ดรวดเดียวทั้งโปรเจกต์ ให้ทำตามขั้นตอนนี้:
1. วิเคราะห์และเสนอโครงสร้าง (Text Wireframe / Component Tree) ให้ผู้ใช้อนุมัติก่อน
2. เมื่ออนุมัติ ให้เริ่ม Refactor ทีละ Component หรือทีละ Route
3. เช็คทุกครั้งว่า CSS Variables ถูกนำมาใช้อย่างถูกต้องเพื่อรองรับโหมดมืด/สว่าง
4. อัปเดตสถานะการทำงานในส่วน "5. Current Progress" ด้านล่างนี้เมื่อทำงานเสร็จในแต่ละส่วน

---

## 📋 5. Current Progress & Roadmap (สถานะการทำงาน)
*(AI และ User สามารถมาอัปเดต Checkbox ตรงนี้ได้เพื่อความต่อเนื่อง)*

### 🟢 To Do (สิ่งที่ต้องทำ)
- [x] Refactor หน้า `/arena` (แยก CSS Modules และจัด Layout ใหม่)
- [x] Refactor หน้า `/advent` (ปรับปรุง UI Card บอส)
- [x] Refactor หน้า `/tierlist` (ปรับปรุงตารางจัดอันดับให้รองรับ Mobile ได้ดีขึ้น)
- [x] ปรับปรุง UI ของระบบ Admin (ถ้ามี)

### 🟡 In Progress (กำลังทำ)
- [ ] รอรับคำสั่งจากผู้ใช้...

### 🔴 Completed (เสร็จแล้ว)
- [x] ตั้งค่า AI_BRIEF.md สำหรับการทำงานต่อเนื่อง
- [x] Refactor หน้า Home (`/`) - ปรับปรุง UI/UX ให้เป็นสไตล์ Professional Gaming Database
- [x] Refactor หน้า Hero Builds (`/build`) - ปรับปรุงการแสดงผลการ์ดและระบบ Filter ให้ดู High-End