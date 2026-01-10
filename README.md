# HVDC Logistics Dashboard

**Samsung C&T HVDC Lightning Project** - Logistics Management System

A comprehensive dashboard for tracking and managing international shipments, container details, and warehouse inventory specific to the HVDC project. Built with **Next.js 15**, **Supabase**, and **Python**.

## 📚 Project Documentation

The documentation for this project is organized into three main sections:

### 1. [System Architecture](./SYSTEM_ARCHITECTURE.md)
*   **High-Level Architecture**: Jamstack structure (Next.js + Supabase).
*   **Data Pipeline**: ETL flow (Excel -> Python -> DB).
*   **Database Schema**: Detailed ER diagrams and table relationships.
*   **Security & Deployment**: RLS policies and infrastructure.

### 2. [UI/UX Design](./UI_UX_DESIGN.md)
*   **Design System**: Color palette (Tailwind), Typography, and Icons.
*   **Component Hierarchy**: Structure of Desktop vs. Mobile components.
*   **User Flows**: Interaction design for filtering, PWA installation, and more.

### 3. [Mobile & PWA Guide](./hvdc-dashboard/MOBILE_GUIDE.md)
*   **Mobile Access**: How to access the PWA via local network.
*   **Installation**: Step-by-step PWA installation guide for iOS/Android.
*   **Features**: Mobile-specific capabilities (Touch UI, Quick Stats).

---

## ⚡️ Quick Start

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   Supabase Project

### 1. Environment Setup
Create `.env.local` in `hvdc-dashboard/`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Run Migration
Place `HVDC STATUS_1.xlsx` in the project root.
```bash
python hvdc_migration_script.py
```

### 3. Start Application
```bash
cd hvdc-dashboard
npm run dev -- --webpack
```
Access at: `http://localhost:3001`

---

## 🛠 Tech Stack
*   **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide Icons
*   **Backend**: Supabase (PostgreSQL), Next.js API Routes
*   **Data**: Python (Pandas) for ETL

---
© 2025 Samsung C&T. All Rights Reserved.
