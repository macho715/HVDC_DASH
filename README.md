# HVDC Logistics Dashboard

**Samsung C&T HVDC Lightning Project** - Logistics Management System

A comprehensive dashboard for tracking and managing international shipments, container details, and warehouse inventory specific to the HVDC project. Built with **Next.js 15**, **Supabase**, and **Python**.

![Dashboard Preview](https://via.placeholder.com/800x400?text=HVDC+Logistics+Dashboard+Preview)

## 🚀 Key Features

*   **Real-time Shipment Tracking**: Track shipments from `Pending` to `Delivered` with detailed status breakdowns.
*   **Warehouse Inventory Management**: Monitor stock levels across multiple locations (DSV, JDN, etc.) with specific date tracking.
*   **Automated Data Migration**: Python scripts to seamlessly import and update data from Excel logistics reports.
*   **Interactive Statistics**: Visualize data with charts for Vendor performance, Port volume, and Monthly trends.
*   **Delay Alerts**: Automatic detection and alerting of delayed shipments based on ETA.

## 🛠 Tech Stack

*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
*   **Backend / Database**: Supabase (PostgreSQL), PostgREST
*   **Data Processing**: Python (Pandas) for ETL operations
*   **Deployment**: Vercel (Frontend), GitHub (Source Control)

## 📂 Project Structure

```
HVDC_DASH/
├── hvdc-dashboard/          # Next.js Frontend Application
│   ├── src/app/             # App Router Pages & API Routes
│   ├── src/components/      # React Components (Dashboard, ShipmentList)
│   ├── src/lib/             # Utility Libraries (Supabase Client)
│   └── public/              # Static Assets
├── files/                   # Python Migration Scripts & Guides
│   ├── hvdc_migration_script_upsert.py  # Main Data Import Script
│   └── verify_database.py               # DB Integrity Check Script
├── hvdc_logistics_schema.sql      # Main Database Schema
├── restore_views.sql              # SQL to Restore Views & Reload Cache
└── reset_database_and_cache.sql   # Full Database Reset Script (Emergency)
```

## ⚡️ Quick Start

### 1. Prerequisites
*   Node.js 18+
*   Python 3.10+
*   Supabase Project

### 2. Environment Setup

**Frontend (`hvdc-dashboard/.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Backend (`.env` for Python):**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Initialization
Run the provided SQL scripts in your Supabase SQL Editor in this order:
1.  `hvdc_logistics_schema.sql` (Creates tables)
2.  `restore_views.sql` (Creates views and reloads API cache)

### 4. Data Migration
Place your Excel file (`HVDC STATUS_1.xlsx`) in the `hvdc-dashboard` folder and run:
```bash
python files/hvdc_migration_script_upsert.py
```

### 5. Running the Application
```bash
cd hvdc-dashboard
npm install
npm run dev
```
Access the dashboard at `http://localhost:3000` (or 3001 if port is busy).

## 🔄 API Endpoints

*   `GET /api/shipments`: Filterable list of all shipments.
*   `GET /api/shipments/[id]`: Single shipment details.
*   `GET /api/statistics`: Aggregated dashboard metrics.
*   `POST /api/shipments`: Bulk upload endpoint.

## 👥 Authors
*   **Macho715** - *Initial Work & Development*

---
© 2025 Samsung C&T. All Rights Reserved.
