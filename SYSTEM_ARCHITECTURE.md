# HVDC Logistics Dashboard - System Architecture

## 1. Overview
The **HVDC Logistics Dashboard** is a web-based platform designed to visualize and manage international shipment data for the Samsung C&T HVDC Project. It centralizes data from Excel-based logistics reports into a relational database, providing real-time tracking, inventory management, and statistical analysis.

---

## 2. High-Level Architecture
The system follows a modern **Jamstack** architecture:
*   **Frontend**: Next.js 15 (Server Side Rendering + Client Components) + PWA Support.
*   **Backend**: Serverless API Routes (Next.js) acting as a gateway to Supabase.
*   **Database**: Supabase (PostgreSQL) with PostgREST APIs.
*   **ETL Pipeline**: Python scripts for data cleaning and migration.

```mermaid
graph TD
    User[End User] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Request| NextJS[Next.js App Server]
    
    subgraph Frontend_Layer
        NextJS -->|Render| Page[Pages / Components]
        Page -->|Fetch Data| API[API Routes /api/*]
    end
    
    subgraph Backend_Layer
        API -->|Supabase JS| Supabase[Supabase Platform]
        Supabase -->|Query| DB[(PostgreSQL Database)]
        Supabase -->|Auth| Auth[GoTrue Auth]
    end
    
    subgraph Data_Pipeline
        Excel[Excel Reports] -->|Read| Python[Python ETL Script]
        Python -->|Cleaning & Mapping| Python
        Python -->|Upsert| DB
    end
```

---

## 3. Data Pipeline & Migration Flow
The system synchronizes data from legacy Excel files (`HVDC STATUS_1.xlsx`) to the PostgreSQL database.

**Key Steps:**
1.  **Extraction**: `pandas` reads the Excel file.
2.  **Transformation**:
    *   Data cleaning (whitespace removal, type conversion).
    *   Date parsing (Excel serial dates -> ISO 8601).
    *   Logic mapping (e.g., Status determination based on ATA/Delivery Date).
3.  **Loading**: Upsert operations to `shipments`, followed by re-insertion of `container_details` and `warehouse_inventory`.

```mermaid
sequenceDiagram
    participant Admin
    participant Excel as Excel File
    participant Script as Python ETL
    participant DB as Supabase DB

    Admin->>Script: Run Migration Script
    Script->>Excel: Read 'Sheet1'
    Excel-->>Script: Return DataFrame
    
    loop For Each Row
        Script->>Script: Normalize Data (Vendor, Ship Mode)
        Script->>DB: UPSERT Shipment (on conflict: sct_ship_no)
        
        opt Data Changed
            Script->>DB: INSERT New Container Data
            Script->>DB: INSERT New Warehouse Data
        end
    end
    
    DB-->>Script: 201 Created / 200 OK
    Script-->>Admin: Migration Complete (Stats)
```

---

## 4. Database Schema (ER Diagram)
The database is normalized into central shipment records and related child tables for specific details.

```mermaid
erDiagram
    SHIPMENTS ||--o{ CONTAINER_DETAILS : "has"
    SHIPMENTS ||--o{ WAREHOUSE_INVENTORY : "stores_at"
    SHIPMENTS ||--o{ FINANCIAL_TRANSACTIONS : "incurs"
    SHIPMENTS ||--o{ SHIPMENT_TRACKING_LOG : "logs"

    SHIPMENTS {
        uuid id PK
        string sct_ship_no UK "Unique Tracking No"
        date etd "Est. Departure"
        date eta "Est. Arrival"
        string status "pending, in_transit, arrived..."
        numeric cif_value
        string vendor
    }

    CONTAINER_DETAILS {
        uuid id PK
        uuid shipment_id FK
        int qty_40hc
        int qty_20dc
        int total_containers
    }

    WAREHOUSE_INVENTORY {
        uuid id PK
        uuid shipment_id FK
        date dsv_indoor "Date In"
        date dsv_outdoor "Date In"
        date jdn_waterfront "Date In"
    }

    FINANCIAL_TRANSACTIONS {
        uuid id PK
        uuid shipment_id FK
        string type "invoice, duty, freight"
        numeric amount
        string currency
    }
```

---

## 5. Technology Stack Details

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Core application framework. |
| **Language** | TypeScript | Type-safe development for both frontend and API. |
| **Styling** | Tailwind CSS | Utility-first CSS for responsive UI. |
| **Database** | PostgreSQL (Supabase) | Relational database with Row Level Security (RLS). |
| **ORM / Client** | supabase-js | JavaScript client for database interaction. |
| **ETL Script** | Python (Pandas) | Data processing and migration logic. |
| **Hosting** | Vercel (Recommended) | Optimized hosting for Next.js. |

## 6. Security
*   **Row Level Security (RLS)**: Enabled on all tables. Currently configured to allow authenticated access (service role) for the dashboard and migration script.
*   **Environment Variables**: Sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`) are stored in `.env.local` and never exposed to the client-side bundle.

---

## 7. Additional Diagrams

### 7.1. Shipment State Lifecycle
The status of a shipment transitions automatically based on date fields.

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Scheduled: ETD populated
    Scheduled --> InTransit: ATD populated
    InTransit --> Arrived: ATA populated
    Arrived --> Delivered: Delivery Date populated
    Delivered --> [*]
    
    Pending --> Delayed: Current Date > ETA
    Delayed --> InTransit: ATD populated
```

### 7.2. Deployment Infrastructure
```mermaid
graph LR
    subgraph Local_Dev [Local Environment]
        Dev[Developer]
        Code[VS Code]
    end
    
    subgraph GitHub_Repo [GitHub]
        Repo[Source Code]
        Action[GitHub Actions (Future)]
    end
    
    subgraph Vercel_Cloud [Vercel Cloud]
        Build[Build System]
        Edge[Edge Network]
    end
    
    subgraph Supabase_Cloud [Supabase Cloud]
        DB_Inst[PostgreSQL Instance]
        Auth_Svc[Auth Service]
    end

    Dev -->|Push| Repo
    Repo -->|Trigger| Build
    Build -->|Deploy| Edge
    Edge -->|Connect| DB_Inst
```
