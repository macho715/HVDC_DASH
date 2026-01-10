'use client'

import { useState, useEffect } from 'react'
import { Package, TrendingUp, AlertTriangle, Scale, Container, CheckCircle, Clock } from 'lucide-react'
import GlobalMap from './GlobalMap'

interface DashboardStats {
    overview: {
        total_shipments: number
        in_transit_shipments: number
        arrived_shipments: number
        delivered_shipments: number
        total_containers: number
        total_weight_kg: number
        total_cbm: number
    }
    status_breakdown: Record<string, number>
    delayed_shipments: {
        sct_ship_no: string
        vessel_name: string
        days_delayed: number
    }[]
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/statistics')
            .then(res => res.json())
            .then(data => {
                setStats(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading Dashboard...</span>
            </div>
        )
    }

    if (!stats) return <div className="p-4 text-red-500">Failed to load statistics.</div>

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Logistics Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time tracking and metrics</p>
                </div>
                <div className="text-sm text-gray-400 flex items-center bg-gray-50 px-3 py-1 rounded-full border">
                    <Clock className="w-4 h-4 mr-2" />
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DashboardCard
                    title="Total Shipments"
                    value={stats.overview.total_shipments}
                    icon={<Package className="w-6 h-6 text-blue-600" />}
                    trend="+12% from last month"
                    color="bg-blue-50 border-blue-100"
                />

                <DashboardCard
                    title="In Transit"
                    value={stats.overview.in_transit_shipments}
                    icon={<TrendingUp className="w-6 h-6 text-amber-600" />}
                    subValue={`${stats.status_breakdown.pending || 0} Pending`}
                    color="bg-amber-50 border-amber-100"
                />

                <DashboardCard
                    title="Total Containers"
                    value={stats.overview.total_containers}
                    icon={<Container className="w-6 h-6 text-emerald-600" />}
                    subValue={`${(stats.overview.total_cbm / 1000).toFixed(1)}k CBM`}
                    color="bg-emerald-50 border-emerald-100"
                />

                <DashboardCard
                    title="Total Weight"
                    value={`${((stats.overview.total_weight_kg || 0) / 1000).toFixed(1)}`}
                    unit="Ton"
                    icon={<Scale className="w-6 h-6 text-purple-600" />}
                    color="bg-purple-50 border-purple-100"
                />
            </div>

            <div className="mb-8">
                <GlobalMap />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Alerts & Breakdown */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Delayed Shipments Alert */}
                    {stats.delayed_shipments && stats.delayed_shipments.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                            <div className="p-4 bg-red-100 border-b border-red-200 flex items-center text-red-800">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                <h3 className="font-bold">Attention Required: {stats.delayed_shipments.length} Delayed Shipments</h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-3">
                                    {stats.delayed_shipments.slice(0, 3).map((s) => (
                                        <li key={s.sct_ship_no} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                            <div className="flex items-center">
                                                <span className="w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                                                <span className="font-semibold text-gray-800 mr-2">{s.sct_ship_no}</span>
                                                <span className="text-gray-500 text-sm">- {s.vessel_name}</span>
                                            </div>
                                            <span className="text-red-600 font-medium px-2 py-1 bg-red-50 rounded text-sm">
                                                +{s.days_delayed} days
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                {stats.delayed_shipments.length > 3 && (
                                    <button className="w-full mt-3 text-center text-red-600 text-sm hover:underline">
                                        View all {stats.delayed_shipments.length} delayed shipments
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status Breakdown Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-slate-400" />
                            Shipment Status Distribution
                        </h2>
                        <div className="flex items-end space-x-2 h-32">
                            {Object.entries(stats.status_breakdown).map(([status, count]) => {
                                const height = Math.max((count / stats.overview.total_shipments) * 100, 10);
                                return (
                                    <div key={status} className="flex-1 flex flex-col justify-end group">
                                        <div
                                            className="w-full bg-slate-100 rounded-t-lg relative group-hover:bg-blue-50 transition-colors"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 font-bold text-slate-700">
                                                {count}
                                            </div>
                                        </div>
                                        <div className="text-center mt-2 text-xs text-gray-500 uppercase tracking-wider truncate">
                                            {status.replace('_', ' ')}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Metrics / Quick Stats */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <StatRow label="Delivered" value={stats.overview.delivered_shipments} total={stats.overview.total_shipments} color="bg-green-500" />
                            <StatRow label="In Transit" value={stats.overview.in_transit_shipments} total={stats.overview.total_shipments} color="bg-blue-500" />
                            <StatRow label="Arrived" value={stats.overview.arrived_shipments} total={stats.overview.total_shipments} color="bg-yellow-500" />
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-500">Volume Utilization</span>
                                    <span className="text-sm font-bold text-gray-700">84%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-slate-800 h-2 rounded-full" style={{ width: '84%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DashboardCard({ title, value, unit, icon, trend, subValue, color }: any) {
    return (
        <div className={`p-6 rounded-xl border transition-all hover:shadow-md ${color} bg-opacity-40`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white bg-opacity-80 rounded-lg shadow-sm">
                    {icon}
                </div>
                {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">{title}</div>
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-slate-800">{value}</span>
                    {unit && <span className="ml-1 text-sm text-gray-500 font-medium">{unit}</span>}
                </div>
                {subValue && <div className="mt-1 text-sm text-gray-500">{subValue}</div>}
            </div>
        </div>
    )
}

function StatRow({ label, value, total, color }: any) {
    const percentage = ((value / total) * 100).toFixed(0);
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{value} <span className="text-gray-400 text-xs">({percentage}%)</span></span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`${color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}
