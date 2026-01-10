"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { KpiStrip } from "./dashboard/KpiStrip";
import { SavedViewsBar } from "./dashboard/SavedViewsBar";
import { WorklistToolbar } from "./dashboard/WorklistToolbar";
import { WorklistTable } from "./dashboard/WorklistTable";
import { DetailDrawer } from "./dashboard/DetailDrawer";
import type { DashboardPayload } from "@/types/worklist";

export default function Dashboard() {
    const applyPayload = useDashboardStore((s) => s.applyPayload);

    // DEV: mock payload 주입 (실운영에서는 WS/REST로 교체)
    useEffect(() => {
        // Mock Payload for initialization
        const mockPayload: DashboardPayload = {
            lastRefreshAt: new Date().toISOString(),
            kpis: {
                driAvg: 98.7,
                wsiAvg: 95.2,
                redCount: 4,
                overdueCount: 12,
                recoverableAED: 150000,
                zeroStops: 2,
            },
            rows: [
                {
                    id: "SHIP-001",
                    kind: "SHIPMENT",
                    title: "SCT-SHIP-001",
                    subtitle: "Vendor A · AIR · BUSAN→JEA",
                    gate: "GREEN",
                    score: 100,
                    dueAt: "2026-01-20",
                    eta: "2026-01-18",
                    triggers: [],
                    ref: { shptNo: "001" },
                },
                {
                    id: "SHIP-002",
                    kind: "SHIPMENT",
                    title: "SCT-SHIP-002",
                    subtitle: "Vendor B · SEA · ROTTERDAM→JEBEL ALI",
                    gate: "RED",
                    score: 45,
                    dueAt: "2026-01-05", // Overdue
                    eta: "2026-01-04",
                    triggers: ["DO_MISSING", "CUSTOMS_START_MISSING"],
                    ref: { shptNo: "002" },
                },
                // ... more mock data
            ],
        };
        applyPayload(mockPayload);
    }, [applyPayload]);

    return (
        <div className="flex flex-col gap-4">
            <KpiStrip />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
                <section className="rounded-xl border bg-white">
                    <div className="flex flex-col gap-3 p-4">
                        <SavedViewsBar />
                        <WorklistToolbar />
                        <WorklistTable />
                    </div>
                </section>

                <aside className="hidden lg:block">
                    <DetailDrawer mode="sidepanel" />
                </aside>

                {/* mobile drawer overlay */}
                <div className="lg:hidden">
                    <DetailDrawer mode="overlay" />
                </div>
            </div>
        </div>
    );
}
