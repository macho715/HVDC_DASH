"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { KpiStrip } from "./dashboard/KpiStrip";
import { SavedViewsBar } from "./dashboard/SavedViewsBar";
import { WorklistToolbar } from "./dashboard/WorklistToolbar";
import { WorklistTable } from "./dashboard/WorklistTable";
import { DetailDrawer } from "./dashboard/DetailDrawer";

export default function Dashboard() {
    const applyPayload = useDashboardStore((s) => s.applyPayload);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API에서 데이터 로드
    useEffect(() => {
        async function fetchWorklist() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/worklist");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const payload = await response.json();
                applyPayload(payload);
            } catch (err: any) {
                console.error("Failed to fetch worklist:", err);
                setError(err.message || "Failed to load data");
                // Store에 Fallback 데이터 적용 (이미 API에서 Fallback 반환하지만 추가 안전장치)
            } finally {
                setLoading(false);
            }
        }

        fetchWorklist();

        // 주기적 갱신 (5분마다)
        const interval = setInterval(fetchWorklist, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [applyPayload]);

    return (
        <div className="flex flex-col gap-4">
            {loading && (
                <div className="rounded-lg border bg-white p-4 text-center text-sm text-slate-500">
                    Loading worklist data...
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-amber-500 bg-amber-50 p-4 text-sm text-amber-800">
                    ⚠️ Error: {error} (Using fallback data)
                </div>
            )}

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
