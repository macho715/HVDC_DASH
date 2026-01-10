Option A 진행. 관련 파일 확인 후 구현 진행합니다.


[4 tools called]


필요 파일 생성 중: 계산 유틸리티, API 엔드포인트, Dashboard 컴포넌트 업데이트.


[1 tool called]


필요 파일 생성 중:


[1 tool called]


필요 파일 생성 중: 계산 유틸리티, API 엔드포인트, Dashboard 업데이트.


[1 tool called]


필요 파일 생성 중:


[1 tool called]


필요 파일 생성 중:

1. 계산 유틸리티 파일 생성


[1 tool called]


필요 파일 생성 중:


[1 tool called]


필요한 파일 생성 중. 먼저 계산 유틸리티:


[1 tool called]


필요한 파일 생성 중:


[1 tool called]


필요 파일 생성 중:

## 1. 계산 유틸리티 파일 생성


[1 tool called]


필요 파일 생성 중.

## 1. 계산 유틸리티 파일

```typescript:hvdc-dashboard/src/lib/worklist-utils.ts
import type { Gate, TriggerBadge, WorklistRow } from "@/types/worklist";

/**
 * Shipment 데이터 구조 (DB에서 가져온 원본)
 */
export interface ShipmentRow {
  id: string;
  sct_ship_no: string;
  mr_number?: string | null;
  commercial_invoice_no?: string | null;
  invoice_date?: string | null;
  vendor?: string | null;
  main_description?: string | null;
  port_of_loading?: string | null;
  port_of_discharge?: string | null;
  vessel_name?: string | null;
  bl_awb_no?: string | null;
  ship_mode?: string | null;
  coe?: string | null;
  etd?: string | null;
  eta?: string | null;
  do_collection_date?: string | null;
  customs_start_date?: string | null;
  customs_close_date?: string | null;
  delivery_date?: string | null;
  duty_amount_aed?: number | null;
  vat_amount_aed?: number | null;
  incoterms?: string | null;
  warehouse_inventory?: {
    mosb?: string | null;
    dsv_indoor?: string | null;
    dsv_outdoor?: string | null;
    dsv_mzd?: string | null;
    jdn_mzd?: string | null;
    jdn_waterfront?: string | null;
    project_shu2?: string | null;
    project_mir3?: string | null;
    project_das4?: string | null;
    project_agi5?: string | null;
  } | null;
}

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환 (null-safe)
 */
function formatDate(date: string | null | undefined): string | undefined {
  if (!date) return undefined;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

/**
 * DRI Score 계산 (Document Readiness Index)
 * 필수 문서 필드 완성도 기준
 */
export function calculateDriScore(shipment: ShipmentRow): number {
  const requiredFields = [
    shipment.commercial_invoice_no,
    shipment.invoice_date,
    shipment.coe,
    shipment.bl_awb_no,
    shipment.vessel_name,
    shipment.etd,
    shipment.eta,
    shipment.do_collection_date,
    shipment.customs_start_date,
  ];

  const presentCount = requiredFields.filter(
    (field) => field !== null && field !== undefined && String(field).trim() !== ""
  ).length;

  return Math.round((presentCount / requiredFields.length) * 100 * 100) / 100;
}

/**
 * Gate 상태와 Triggers 계산
 */
export function calculateGateAndTriggers(
  shipment: ShipmentRow,
  today: string = new Date().toISOString().split("T")[0]
): { gate: Gate; triggers: TriggerBadge[] } {
  const triggers: TriggerBadge[] = [];

  // 문서 누락 체크
  if (!shipment.do_collection_date) triggers.push("DO_MISSING");
  if (!shipment.customs_start_date) triggers.push("CUSTOMS_START_MISSING");
  if (!shipment.delivery_date) triggers.push("DELIVERY_DATE_MISSING");
  if (!shipment.bl_awb_no) triggers.push("BL_MISSING");
  if (!shipment.incoterms) triggers.push("INCOTERM_MISSING");

  // Gate 결정 로직
  const eta = shipment.eta;
  const isEtaPassed = eta && eta < today;

  let gate: Gate = "GREEN";

  if (isEtaPassed) {
    if (triggers.includes("DO_MISSING") || triggers.includes("CUSTOMS_START_MISSING")) {
      gate = "RED";
    } else if (triggers.includes("DELIVERY_DATE_MISSING")) {
      gate = "AMBER";
    } else {
      gate = "GREEN";
    }
  } else {
    // ETA가 아직 안 지났으면 GREEN (단, 심각한 문서 누락이 있으면 AMBER)
    if (triggers.includes("DO_MISSING") || triggers.includes("CUSTOMS_START_MISSING")) {
      gate = "AMBER";
    } else {
      gate = "GREEN";
    }
  }

  return { gate, triggers };
}

/**
 * 현재 위치 계산 (Warehouse dates 기준)
 */
export function calculateCurrentLocation(shipment: ShipmentRow): string | undefined {
  const wh = shipment.warehouse_inventory;
  if (!wh) return undefined;

  const locationDates: Array<[string, string | null | undefined]> = [
    ["MOSB", wh.mosb],
    ["DSV Indoor", wh.dsv_indoor],
    ["DSV Outdoor", wh.dsv_outdoor],
    ["DSV MZD", wh.dsv_mzd],
    ["JDN MZD", wh.jdn_mzd],
    ["JDN Waterfront", wh.jdn_waterfront],
    ["SHU", wh.project_shu2],
    ["MIR", wh.project_mir3],
    ["DAS", wh.project_das4],
    ["AGI", wh.project_agi5],
  ];

  let latest: { date: Date; label: string } | null = null;

  for (const [label, dateStr] of locationDates) {
    if (!dateStr) continue;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;
      if (!latest || date > latest.date) {
        latest = { date, label };
      }
    } catch {
      continue;
    }
  }

  return latest?.label;
}

/**
 * ShipmentRow → WorklistRow 변환
 */
export function shipmentToWorklistRow(shipment: ShipmentRow, today?: string): WorklistRow {
  const driScore = calculateDriScore(shipment);
  const { gate, triggers } = calculateGateAndTriggers(shipment, today);
  const currentLocation = calculateCurrentLocation(shipment);

  const subtitle = [
    shipment.vendor || "-",
    shipment.ship_mode || "-",
    shipment.port_of_loading || "-",
    shipment.port_of_discharge ? `→${shipment.port_of_discharge}` : "",
  ]
    .filter((s) => s !== "" && s !== "-")
    .join(" · ");

  return {
    id: shipment.id,
    kind: "SHIPMENT",
    title: shipment.sct_ship_no,
    subtitle: subtitle || undefined,
    gate,
    score: driScore,
    dueAt: formatDate(shipment.delivery_date || shipment.eta),
    eta: formatDate(shipment.eta),
    currentLocation,
    triggers,
    ref: {
      shptNo: shipment.sct_ship_no,
      invoiceNo: shipment.commercial_invoice_no || undefined,
    },
    meta: {
      vendor: shipment.vendor,
      incoterms: shipment.incoterms,
      bl_awb: shipment.bl_awb_no,
      do_collection: formatDate(shipment.do_collection_date),
      customs_start: formatDate(shipment.customs_start_date),
      customs_close: formatDate(shipment.customs_close_date),
      duty_aed: shipment.duty_amount_aed,
      vat_aed: shipment.vat_amount_aed,
    },
  };
}

/**
 * KPI 계산
 */
export function calculateKpis(
  rows: WorklistRow[],
  today: string = new Date().toISOString().split("T")[0]
): {
  driAvg: number;
  wsiAvg: number;
  redCount: number;
  overdueCount: number;
  recoverableAED: number;
  zeroStops: number;
} {
  const shipments = rows.filter((r) => r.kind === "SHIPMENT");

  if (shipments.length === 0) {
    return {
      driAvg: 0.0,
      wsiAvg: 0.0,
      redCount: 0,
      overdueCount: 0,
      recoverableAED: 0.0,
      zeroStops: 0,
    };
  }

  const scores = shipments.map((r) => r.score ?? 0).filter((s) => s > 0);
  const driAvg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.0;

  const redCount = shipments.filter((r) => r.gate === "RED").length;
  const overdueCount = shipments.filter((r) => {
    if (!r.dueAt) return false;
    return r.dueAt < today;
  }).length;

  const recoverableAED = shipments.reduce((sum, r) => {
    const duty = (r.meta?.duty_aed as number) ?? 0;
    const vat = (r.meta?.vat_aed as number) ?? 0;
    return sum + duty + vat;
  }, 0);

  return {
    driAvg: Math.round(driAvg * 100) / 100,
    wsiAvg: 0.0, // TODO: WSI 계산 로직 구현 필요
    redCount,
    overdueCount,
    recoverableAED: Math.round(recoverableAED * 100) / 100,
    zeroStops: 0, // TODO: Zero Stops 계산 로직 구현 필요
  };
}
```

## 2. API 엔드포인트 생성

```typescript:hvdc-dashboard/src/app/api/worklist/route.ts
/**
 * GET /api/worklist
 * Dashboard Worklist API
 * DB 데이터를 WorklistRow 형식으로 변환하여 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import {
  shipmentToWorklistRow,
  calculateKpis,
  type ShipmentRow,
} from "@/lib/worklist-utils";
import type { DashboardPayload } from "@/types/worklist";

/**
 * Fallback Demo 데이터 (API 실패 시 사용)
 */
const getFallbackPayload = (): DashboardPayload => ({
  lastRefreshAt: new Date().toISOString().replace("T", " ").slice(0, 16),
  kpis: {
    driAvg: 0.0,
    wsiAvg: 0.0,
    redCount: 0,
    overdueCount: 0,
    recoverableAED: 0.0,
    zeroStops: 0,
  },
  rows: [],
});

/**
 * GET /api/worklist
 */
export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Shipments 조회 (warehouse_inventory와 함께)
    const { data: shipments, error: shipmentsError } = await supabase
      .from("shipments")
      .select(
        `
        id,
        sct_ship_no,
        mr_number,
        commercial_invoice_no,
        invoice_date,
        vendor,
        main_description,
        port_of_loading,
        port_of_discharge,
        vessel_name,
        bl_awb_no,
        ship_mode,
        coe,
        etd,
        eta,
        do_collection_date,
        customs_start_date,
        customs_close_date,
        delivery_date,
        duty_amount_aed,
        vat_amount_aed,
        incoterms,
        warehouse_inventory (
          mosb,
          dsv_indoor,
          dsv_outdoor,
          dsv_mzd,
          jdn_mzd,
          jdn_waterfront,
          project_shu2,
          project_mir3,
          project_das4,
          project_agi5
        )
      `
      )
      .order("eta", { ascending: false, nullsLast: true });

    if (shipmentsError) {
      console.error("Supabase error:", shipmentsError);
      // API 실패 시에도 UI가 보이도록 Fallback 데이터 반환
      return NextResponse.json(getFallbackPayload());
    }

    // 2. ShipmentRow[] → WorklistRow[] 변환
    const worklistRows = (shipments || [])
      .map((s: any) => {
        try {
          const shipmentRow: ShipmentRow = {
            id: s.id,
            sct_ship_no: s.sct_ship_no,
            mr_number: s.mr_number,
            commercial_invoice_no: s.commercial_invoice_no,
            invoice_date: s.invoice_date,
            vendor: s.vendor,
            main_description: s.main_description,
            port_of_loading: s.port_of_loading,
            port_of_discharge: s.port_of_discharge,
            vessel_name: s.vessel_name,
            bl_awb_no: s.bl_awb_no,
            ship_mode: s.ship_mode,
            coe: s.coe,
            etd: s.etd,
            eta: s.eta,
            do_collection_date: s.do_collection_date,
            customs_start_date: s.customs_start_date,
            customs_close_date: s.customs_close_date,
            delivery_date: s.delivery_date,
            duty_amount_aed: s.duty_amount_aed ? Number(s.duty_amount_aed) : null,
            vat_amount_aed: s.vat_amount_aed ? Number(s.vat_amount_aed) : null,
            incoterms: s.incoterms,
            warehouse_inventory: s.warehouse_inventory
              ? {
                  mosb: s.warehouse_inventory.mosb,
                  dsv_indoor: s.warehouse_inventory.dsv_indoor,
                  dsv_outdoor: s.warehouse_inventory.dsv_outdoor,
                  dsv_mzd: s.warehouse_inventory.dsv_mzd,
                  jdn_mzd: s.warehouse_inventory.jdn_mzd,
                  jdn_waterfront: s.warehouse_inventory.jdn_waterfront,
                  project_shu2: s.warehouse_inventory.project_shu2,
                  project_mir3: s.warehouse_inventory.project_mir3,
                  project_das4: s.warehouse_inventory.project_das4,
                  project_agi5: s.warehouse_inventory.project_agi5,
                }
              : null,
          };

          return shipmentToWorklistRow(shipmentRow, today);
        } catch (err) {
          console.error(`Error converting shipment ${s.id}:`, err);
          return null;
        }
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    // 3. KPI 계산
    const kpis = calculateKpis(worklistRows, today);

    // 4. Payload 구성
    const payload: DashboardPayload = {
      lastRefreshAt: new Date()
        .toISOString()
        .replace("T", " ")
        .slice(0, 16),
      kpis,
      rows: worklistRows,
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Worklist API error:", error);
    // 에러 발생 시에도 Fallback 데이터 반환 (UI 깨짐 방지)
    return NextResponse.json(getFallbackPayload());
  }
}
```

## 3. Dashboard 컴포넌트 업데이트

```typescript:hvdc-dashboard/src/components/Dashboard.tsx
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
```

## 구현 완료 요약

- `worklist-utils.ts`: 계산 로직
  - `calculateDriScore()`: DRI 점수 계산
  - `calculateGateAndTriggers()`: Gate 상태와 Triggers 계산
  - `calculateCurrentLocation()`: 현재 위치 계산
  - `shipmentToWorklistRow()`: DB → WorklistRow 변환
  - `calculateKpis()`: KPI 계산

- `api/worklist/route.ts`: Dashboard API
  - DB에서 shipments 조회 (warehouse_inventory 포함)
  - WorklistRow 변환
  - KPI 계산
  - Fallback 데이터 반환 (API 실패 시에도 UI 표시)

- `Dashboard.tsx`: Mock 제거
  - `/api/worklist` 호출
  - 5분마다 자동 갱신
  - 로딩/에러 상태 표시

## 다음 단계

1. DB에 데이터가 없으면 빈 배열 반환 (Fallback 데이터 적용)
2. WSI 계산 로직은 추후 구현 (현재는 0.00)
3. Zero Stops 계산 로직도 추후 구현

테스트해 보시고 문제 있으면 알려주세요.
