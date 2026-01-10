"use client";

import { useDashboardStore } from "@/store/dashboardStore";

export function KpiStrip() {
    const kpis = useDashboardStore((s) => s.kpis);
    const lastRefreshAt = useDashboardStore((s) => s.lastRefreshAt);

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            <Card k="DRI Avg" v={kpis.driAvg.toFixed(2)} />
            <Card k="WSI Avg" v={kpis.wsiAvg.toFixed(2)} />
            <Card k="Red Count" v={kpis.redCount.toFixed(0)} />
            <Card k="Overdue" v={kpis.overdueCount.toFixed(0)} />
            <Card k="Recoverable (AED)" v={kpis.recoverableAED.toFixed(2)} />
            <Card k="Last Refresh" v={lastRefreshAt ?? "-"} />
        </div>
    );
}

function Card({ k, v }: { k: string; v: string }) {
    return (
        <div className="rounded-xl border bg-white p-3">
            <div className="text-xs text-slate-500">{k}</div>
            <div className="mt-1 text-lg font-semibold tabular-nums">{v}</div>
        </div>
    );
}
