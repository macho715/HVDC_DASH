import Dashboard from '@/components/Dashboard'
import ShipmentList from '@/components/ShipmentList'
import MobileDashboard from '@/components/MobileDashboard'
import MobileShipmentList from '@/components/MobileShipmentList'

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 pb-10">
            {/* Desktop Navigation */}
            <nav className="hidden md:block bg-slate-900 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-tight">HVDC Logistics Dashboard</h1>
                    <span className="text-sm bg-slate-800 px-3 py-1 rounded-full">Samsung C&T</span>
                </div>
            </nav>

            {/* Desktop View */}
            <div className="hidden md:block space-y-8 mt-8">
                <Dashboard />

                <div className="container mx-auto px-4">
                    <ShipmentList />
                </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
                <MobileDashboard />

                <div className="px-4 mt-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Recent Shipments</h3>
                    <MobileShipmentList />
                </div>
            </div>
        </main>
    )
}
