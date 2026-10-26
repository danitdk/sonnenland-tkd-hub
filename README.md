# Sonnenland TKD Hub 🥋

A modern, mobile-friendly **Taekwondo Registration & Payment Management** web application designed for **Sonnenland International School (SIS)**, led by **Master Daniel**.

---

## 🎨 Design System & Color Palette

The project implements a modern, dark-themed martial arts aesthetic:
- **Primary Dark Background**: Deep slate / rich black (`#0B0F19`, `#111827`)
- **Accent Crimson**: `#DC2626` / `#EF4444` (energy, focus, Taekwondo tradition)
- **Accent Gold**: `#F59E0B` / `#D97706` (excellence, championship, honor)
- **Card Surfaces**: `#1F2937` with subtle borders (`#374151`)

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom palette and glow effects
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
c:\Sonnenland TKD Hub
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.js         # Instructor Admin Dashboard for Master Daniel
│   │   ├── globals.css         # Global dark theme variables and custom scrollbar
│   │   ├── layout.js          # Root layout with dark background defaults
│   │   └── page.js            # Parent registration landing page & welcome banner
│   └── components/
│       ├── Badge.js           # Reusable badge (gold/crimson/dark with pulse option)
│       ├── Footer.js          # School info, martial arts tenets & links
│       ├── Navbar.js          # Mobile-friendly header with links to Admin Portal
│       └── RegistrationCard.js # Pricing & term registration card
├── jsconfig.json              # Path aliases (@/* -> ./src/*)
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Custom palette configuration
└── README.md                  # Project documentation
```

---

## ⚡ Key Features

1. **Parent Registration Landing Page (`/`)**:
   - Welcome banner: **Sonnenland TKD Hub**
   - Subtitle: **After School Taekwondo Program – Master Daniel**
   - Registration status badge: **"October 26–28 Registration Open"**
   - Program highlights: Discipline & focus, official belt progression, self-defense & agility.
   - Schedule details: Mondays & Wednesdays, 3:30 PM – 4:45 PM in the SIS Main Gymnasium.
   - Interactive registration form with student, grade, belt level, and parent emergency contacts.

2. **Instructor Admin Dashboard (`/admin`)**:
   - Protected by a **4-digit Security PIN Gate** (Default PIN: `1234`, persists per browser session via `sessionStorage`).
   - Summary Metric KPI Cards: Total Students Enrolled, Total Payments Verified (ETB), Pending Payments (ETB), and Uniforms Needed count.
   - **Manual Student Entry Modal**: Quick "+ Add Student (Phone Call)" entry for parents who call Master Daniel directly, with live fee calculation and instant roster update.
   - **Polite Payment Reminder Generator**: 1-click generator for pending parents in **አማርኛ (Amharic)** and **English**, complete with 1-click clipboard copy, direct Telegram share, and native SMS link.
   - **Export to CSV for Director Betty**: 1-click download of the complete or filtered enrollment roster (`Sonnenland_TKD_Students_[date].csv`) formatted with UTF-8 BOM for Microsoft Excel.
   - Interactive Data Table:
     - Clickable `tel:` parent links
     - Instant toggle for Payment Status (`Pending` ↔ `Verified`)
     - Instant toggle for Uniform Delivery (`Needed` ↔ `Delivered`)
     - Receipt Screenshot Viewer modal with 1-click "Approve Payment" action
     - Delete student action with confirmation modal.

---

## 🛠️ Getting Started

### 1. Install Dependencies
Run in your terminal inside `c:\Sonnenland TKD Hub`:
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Parent Portal**: [http://localhost:3000](http://localhost:3000)
- **Instructor Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
