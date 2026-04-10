import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Zap, Battery, DollarSign, Clock, XCircle, CheckCircle, History as HistoryIcon, User } from 'lucide-react'

export default function ActiveSession() {
    const navigate = useNavigate()

    // 1. Expanded Mock Orders
    const [orders, setOrders] = useState([
        { id: 1, driver: "Rahul S.", car: "Tata Nexon", plate: "TN 09 AB 1234", requested: 5, rate: 7.5 },
        { id: 2, driver: "Priya K.", car: "MG ZS EV", plate: "TN 07 CD 5678", requested: 8, rate: 8.2 },
        { id: 3, driver: "Anish M.", car: "Hyundai Kona", plate: "TN 12 EF 9012", requested: 12, rate: 7.0 },
        { id: 4, driver: "Sanya V.", car: "Tiago EV", plate: "TN 02 GH 3456", requested: 4, rate: 9.0 },
        { id: 5, driver: "Karthik R.", car: "BYD Atto 3", plate: "TN 10 JK 7890", requested: 15, rate: 8.5 },
    ])

    // 2. Heavy Dummy History Data
    const [history, setHistory] = useState([
        { id: 101, driver: "Amit V.", amount: 150.00, units: 20, time: "12 mins ago" },
        { id: 102, driver: "Sneha L.", amount: 84.00, units: 12, time: "45 mins ago" },
        { id: 103, driver: "John Doe", amount: 45.50, units: 6, time: "1 hour ago" },
        { id: 104, driver: "Meera Nair", amount: 210.00, units: 25, time: "3 hours ago" },
        { id: 105, driver: "Rajesh K.", amount: 120.00, units: 15, time: "Yesterday" },
        { id: 106, driver: "Pooja B.", amount: 95.00, units: 10, time: "Yesterday" },
    ])

    const [activeOrder, setActiveOrder] = useState(null)
    const [units, setUnits] = useState(0)
    const [time, setTime] = useState(0)
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastEarnings, setLastEarnings] = useState(0);


    const handleReject = (id) => setOrders(p => p.filter(o => o.id !== id))

    useEffect(() => {
        if (!activeOrder) return
        const t = setInterval(() => {
            setUnits(prev => {
                const next = prev + 0.2
                if (next >= activeOrder.requested) {
                    clearInterval(t)
                    handleCompletion()
                    return activeOrder.requested
                }
                return next
            })
            setTime(p => p + 1)
        }, 1000)
        return () => clearInterval(t)
    }, [activeOrder])

    const handleCompletion = () => {
        const earnings = (units * activeOrder.rate).toFixed(2);
        setLastEarnings(earnings);

        setHistory(p => [{
            id: Date.now(),
            driver: activeOrder.driver,
            amount: parseFloat(earnings),
            units: units.toFixed(2),
            time: "Just now"
        }, ...p]);

        setShowReceipt(true); // This opens the new UI
        setActiveOrder(null);
        setUnits(0);
        setTime(0);
    }


    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    return (
        <div className="min-h-screen bg-carbon text-white flex flex-col lg:flex-row h-screen overflow-hidden">
            {/* MAIN CENTER SECTION */}
            <div className="flex-1 flex flex-col h-full border-r border-white/5 overflow-hidden">
                <div className="px-6 py-5 bg-graphite border-b border-white/5 flex items-center justify-between sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/host')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ChevronLeft size={22} className="text-white/40" />
                        </button>
                        <h1 className="font-display font-black text-lg tracking-tight uppercase">Control Center</h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-volt/10 rounded-full border border-volt/20">
                        <div className="w-2 h-2 bg-volt rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-volt uppercase">Node: Active</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#0B0B0B]">
                    {!activeOrder ? (
                        <div className="space-y-6">
                            <h2 className="text-[11px] text-white/30 uppercase font-black tracking-[0.2em]">Request Queue</h2>
                            <div className="flex flex-wrap gap-4">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-graphite border border-white/5 rounded-2xl p-5 w-full md:w-[calc(50%-1rem)] xl:w-[calc(33.33%-1rem)] hover:border-volt/20 transition-all group">
                                        <div className="flex justify-between mb-4">
                                            <div className="w-10 h-10 bg-steel rounded-xl flex items-center justify-center group-hover:bg-volt/10 transition-colors">
                                                <User size={18} className="text-white/40 group-hover:text-volt" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-volt font-black text-xl">₹{(order.requested * order.rate).toFixed(0)}</p>
                                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{order.requested} kWh</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-base mb-1">{order.driver}</p>
                                        <p className="text-xs text-white/40 mb-4">{order.car} • {order.plate}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleReject(order.id)} className="flex-1 py-2.5 bg-white/5 rounded-xl text-[11px] font-bold text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all">REJECT</button>
                                            <button onClick={() => { setActiveOrder(order); handleReject(order.id); }} className="flex-1 py-2.5 bg-volt rounded-xl text-[11px] font-black text-carbon">ACCEPT</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-8 py-10 animate-fade-in">
                            <div className="text-center">
                                <p className="text-volt font-black uppercase tracking-[0.3em] text-[10px] mb-2">Live Handshake Established</p>
                                <h2 className="text-2xl font-display font-bold">Charging {activeOrder.driver}'s {activeOrder.car}</h2>
                            </div>

                            {/* Live Gauge */}
                            <div className="w-72 h-72 rounded-full border-[14px] border-white/5 border-t-volt flex flex-col items-center justify-center shadow-[0_0_60px_rgba(200,244,0,0.05)] relative">
                                <p className="text-6xl font-black">{units.toFixed(2)}</p>
                                <p className="text-[11px] text-white/20 font-bold uppercase mt-1 tracking-widest">kWh Delivered</p>
                            </div>

                            <div className="flex flex-col w-full max-w-md gap-4">
                                <div className="flex gap-4 w-full">
                                    <div className="flex-1 bg-graphite p-5 rounded-2xl border border-white/5 text-center">
                                        <p className="text-volt font-black text-2xl">₹{(units * activeOrder.rate).toFixed(1)}</p>
                                        <p className="text-[9px] text-white/20 font-bold uppercase mt-1">Revenue</p>
                                    </div>
                                    <div className="flex-1 bg-graphite p-5 rounded-2xl border border-white/5 text-center">
                                        <p className="font-black text-2xl text-white">{fmt(time)}</p>
                                        <p className="text-[9px] text-white/20 font-bold uppercase mt-1">Time</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { if (window.confirm("Cancel session?")) { setActiveOrder(null); setUnits(0); setTime(0); } }}
                                        className="flex-1 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 border border-white/10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCompletion}
                                        className="flex-[2] bg-volt text-carbon hover:bg-volt/90 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(200,244,0,0.2)]"
                                    >
                                        Stop & Collect Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR (HISTORY) */}
            <div className="w-full lg:w-96 bg-graphite flex flex-col h-full">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <HistoryIcon size={18} className="text-volt" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-white/60">Revenue History</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.map(item => (
                        <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center hover:bg-white/[0.04] transition-all">
                            <div>
                                <p className="text-sm font-bold text-white/90">{item.driver}</p>
                                <p className="text-[10px] text-white/30">{item.units} kWh • {item.time}</p>
                            </div>
                            <p className="text-volt font-black text-sm">+₹{item.amount.toFixed(0)}</p>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-graphite border-t border-white/5 mt-auto">
                    <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total Sales</p>
                        <p className="text-2xl font-black text-white">₹{history.reduce((acc, curr) => acc + curr.amount, 0).toFixed(0)}</p>
                    </div>
                </div>
            </div>

            {/* SUCCESS RECEIPT MODAL */}
            {showReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon/60 backdrop-blur-md">
                    <div className="bg-graphite border border-volt/30 w-full max-w-sm rounded-[32px] p-8 text-center shadow-[0_0_50px_rgba(200,244,0,0.15)]">
                        <div className="w-20 h-20 bg-volt/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-volt/20 relative">
                            <CheckCircle size={40} className="text-volt" />
                        </div>
                        <h2 className="text-2xl font-display font-black text-white mb-2">Payment Received</h2>
                        <p className="text-white/40 text-xs mb-8">Transaction completed successfully. Funds added to your wallet.</p>
                        <div className="bg-steel/30 rounded-2xl p-6 mb-8 border border-white/5">
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">Total Payout</p>
                            <p className="text-4xl font-display font-black text-volt">₹{lastEarnings}</p>
                        </div>
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="w-full bg-volt text-carbon font-display font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-volt/20"
                        >
                            DISMISS
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
