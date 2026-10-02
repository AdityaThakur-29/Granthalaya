# Granthalaya — Digital Transformation of Local Libraries

A modern, frontend-first digital library management and circulation system designed specifically for Indian municipal, district, and community public libraries.

Built with **React 19**, **Vite 8**, **shadcn/ui**, **Tailwind CSS v4**, and **Lucide Icons**.

---

## 🏛️ Background & Purpose

Many local and community libraries still depend on paper registers, physical card catalogues, manual issue/return logs, and in-person footfall. 

**Granthalaya** bridges the digital divide with:
- **Clean, Minimalist Interface:** Inspired by enterprise CRM design patterns (high visual hierarchy, light blue accents, subtle borders).
- **Zero-Backend Requirement:** Complete client-side persistence through a centralized `localStorage` architecture with zero external database dependencies.
- **Localized Indian Context:** Pre-seeded with 15 notable Indian literary classics, biographies, and regional works, plus authentic Indian patron profiles and phone formats (+91).
- **Assisted Citizen Access:** Dedicated walk-in kiosk mode for non-tech-savvy visitors and senior citizens.

---

## ✨ Features

### 📖 Reader / Student Experience
- **Interactive Catalogue:** Real-time search across titles, authors, and ISBN numbers.
- **Category Filter Pills:** Fiction, Biography, History, Poetry, Mythology, Classics, Non-Fiction.
- **Book Details View:** Spine accent preview, real-time shelf copy count, loan status, and reservation queue.
- **Instant Hold Reservation:** Reserve titles for counter pickup in 1 click.
- **My Reservations:** Track status of held books (Pending, Approved, Cancelled).

### 🛡️ Librarian Admin Operations
- **Command Dashboard:** 6 real-time KPI metrics, active loan counts, overdue book alerts, and queue clearance.
- **Inventory CRUD:** Add new acquisitions, edit metadata, update physical copy counts, and safely delete titles.
- **Patron Directory CRUD:** Register citizens, track active borrowings per member, and toggle active/inactive status.
- **Circulation Desk:** 
  - Issue books with automated 14-day due date calculation.
  - 1-click Return (automatically restores physical stock to shelf).
  - 1-click Renew (+14 day extension).
- **Reservation Desk:** Approve holds, reject requests, or convert approved holds directly into active loans at the counter.

### 🎫 Assisted Walk-in Kiosk
- **Instant Shelf Availability Scanner:** Rapid query tool for front-desk attendants.
- **Visitor Hold Token Slip:** Generate printable queue hold tokens for non-registered walk-in visitors.
- **Express 1-Click Issue:** Instant physical loan checkout for registered members present in person.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/AdityaThakur-29/Granthalaya.git

# Navigate to project directory
cd Granthalaya

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **UI & Components:** [shadcn/ui](https://ui.shadcn.com/) (Base UI)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Routing:** [React Router v7](https://reactrouter.com/)

---

## 📂 Project Structure

```
src/
├── data/
│   └── store.js           # Centralized localStorage data layer & Indian seed data
├── components/
│   ├── ui/                # shadcn UI components (button, dialog, card, table, etc.)
│   ├── app-header.jsx     # Top navigation bar with branch code & demo reset
│   ├── app-sidebar.jsx    # Grouped navigation & role switcher
│   ├── book-card.jsx      # Spine cover styled catalog card
│   ├── stat-card.jsx      # Dashboard KPI card
│   └── status-badge.jsx   # Color-coded status pills
├── pages/
│   ├── user/              # Catalog, BookDetail, MyReservations
│   └── librarian/         # Dashboard, Books, Members, Transactions, Reservations, Assisted
├── lib/
│   └── utils.js           # Date formatting, overdue calculator, cn() helper
├── App.jsx                # Router & role synchronization
└── main.jsx               # Entry point
```

---

## 📜 License

MIT License. Designed for academic and municipal library modernization initiatives.
