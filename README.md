# HVDC Logistics Dashboard

**Samsung C&T HVDC Lightning Project** - Logistics Management System

A comprehensive dashboard for tracking and managing international shipments, container details, and warehouse inventory specific to the HVDC project. Transformed into a modern enterprise-grade application built with **Next.js 15**, **Supabase**, and **Python**.

---

## 📂 Project Structure

Verified directory structure:

```
HVDC DASH/
├── hvdc-dashboard/     # Next.js Web Application Source
├── data/               # Raw Data Files (HVDC STATUS_1.xlsx)
├── database/           # SQL Schema & Database Scripts
├── docs/               # Documentation (Architecture, Design, Guides)
├── scripts/            # Python ETL & Utility Scripts
└── reference/          # Logs, Backups, and Patch Files
```

---

## 📚 Documentation

The documentation is organized for easy access:

### 1. [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
*   **Tech Stack**: Next.js 15, Supabase, Tailwind CSS 4.
*   **Data Pipeline**: Automated ETL using Python (`scripts/`).
*   **Database Schema**: Relational PostgreSQL design (`database/`).

### 2. [UI/UX Design](./docs/UI_UX_DESIGN.md)
*   **Design Philosophy**: "Modern Enterprise Cockpit" with Sidebar navigation.
*   **Key Features**:
    *   **Sidebar Layout**: Fixed left navigation for quick access.
    *   **Worklist Workbench**: Operational table with Gate logic (Red/Amber/Green).
    *   **Detail Drawer**: Slide-out panel for deep-diving into shipment specifics.
    *   **Zustand State**: Robust client-side state for filters and saved views.

### 3. [Mobile Guide](./docs/MOBILE_GUIDE.md)
*   **PWA Support**: Installable on iOS/Android.
*   **Mobile Layout**: Responsive overlays and touch-friendly lists.

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   Python 3.8+ (for data migration)
*   Supabase Account

### 2. Environment Setup
Create `.env.local` in `hvdc-dashboard/` folder:
```ini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Data Migration (Optional)
If you need to refresh the database from Excel:
1.  Ensure `HVDC STATUS_1.xlsx` is inside the `data/` folder.
2.  Run the script:
    ```bash
    python scripts/hvdc_migration_script.py
    ```

### 4. Start the Application
Due to common port conflicts, we use **Port 3001**.

```bash
cd hvdc-dashboard
npm run dev
```

*   **Dashboard**: [http://localhost:3001](http://localhost:3001)

---

## 🛠 Tech Stack
*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript
*   **State**: Zustand (Client State), Supabase (Remote State)
*   **Styling**: Tailwind CSS, Lucide React Icons
*   **Backend**: Supabase (PostgreSQL), Next.js API Routes

---
© 2026 Samsung C&T. All Rights Reserved.
