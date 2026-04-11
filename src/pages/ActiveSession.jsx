import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Zap, Battery, Clock, XCircle, CheckCircle, History as HistoryIcon, User } from 'lucide-react'
import ChatBot from '../components/HomeChatBot'
import HostAIPanel from '../components/HostaiPanel'

export default function ActiveSession() {
    const navigate = useNavigate()

    const [orders, setOrders] = useState([
        { id: 1, driver: "Rahul S.", car: "Tata Nexon", plate: "TN 09 AB 1234", requested: 5, rate: 7.5 },
        { id: 2, driver: "Priya K.", car: "MG ZS EV", plate: "TN 07 CD 5678", requested: 8, rate: 8.2 },
        { id: 3, driver: "Anish M.", car: "Hyundai Kona", plate: "TN 12 EF 9012", requested: 12, rate: 7.0 },
        { id: 4, driver: "Sanya V.", car: "Tiago EV", plate: "TN 02 GH 3456", requested: 4, rate: 9.0 },
        { id: 5, driver: "Karthik R.", car: "BYD Atto 3", plate: "TN 10 JK 7890", requested: 15, rate: 8.5 },
    ])

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
    const [showReceipt, setShowReceipt] = useState(false)
    const [lastEarnings, setLastEarnings] = useState(0)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [activeTab, setActiveTab] = useState('queue') // 'queue' | 'ai'

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
        const earnings = (units * activeOrder.rate).toFixed(2)
        setLastEarnings(earnings)
        setHistory(p => [{
            id: Date.now(),
            driver: activeOrder.driver,
            amount: parseFloat(earnings),
            units: units.toFixed(2),
            time: "Just now"
        }, ...p])
        setShowReceipt(true)
        setActiveOrder(null)
        setUnits(0)
        setTime(0)
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

                {/* Sub-tabs for Control Center */}
                <div className="flex border-b border-white/5 bg-graphite">
                    {['queue', 'ai'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'text-volt border-b-2 border-volt bg-volt/5'
                                : 'text-white/30 hover:text-white/60'
                                }`}
                        >
                            {tab === 'queue' ? '⚡ Request Queue' : '✦ AI Advisor'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#0B0B0B]">
                    {/* ── QUEUE TAB ── */}
                    {activeTab === 'queue' && (
                        <div className="space-y-6">
                            {!activeOrder ? (
                                <>
                                    <h2 className="text-[11px] text-white/30 uppercase font-black tracking-[0.2em]">Pending Requests</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-graphite border border-white/5 rounded-2xl p-5 w-full md:w-[calc(50%-1rem)] xl:w-[calc(33.33%-1rem)] hover:border-volt/20 transition-all group">
                                                <div className="flex justify-between mb-4">
                                                    <div className="w-10 h-10 bg-steel rounded-xl flex items-center justify-center group-hover:bg-volt/10 transition-colors">
                                                        <User size={18} className="text-white/40 group-hover:text-volt" />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-volt font-black text-xl">₹{(order.requested * order.rate).toFixed(0)}</p>
                                                        <p className="text-white/20 text-[10px]">{order.requested} kWh</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-sm text-white mb-0.5">{order.driver}</p>
                                                <p className="text-white/40 text-xs mb-1">{order.car}</p>
                                                <p className="text-white/20 text-[10px] font-mono mb-4">{order.plate}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setActiveOrder(order); setUnits(0); setTime(0); }}
                                                        className="flex-1 py-2.5 bg-volt text-carbon font-black text-[10px] uppercase tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(order.id)}
                                                        className="px-4 py-2.5 bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 rounded-xl transition-all text-xs"
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {orders.length === 0 && (
                                            <div className="w-full text-center py-12 text-white/20 text-sm">
                                                No pending requests
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // Active Charging Session
                                <div className="space-y-6">
                                    <h2 className="text-[11px] text-white/30 uppercase font-black tracking-[0.2em]">Active Session</h2>
                                    <div className="bg-graphite border border-volt/20 rounded-2xl p-6 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-white text-lg">{activeOrder.driver}</p>
                                                <p className="text-white/40 text-xs">{activeOrder.car} · {activeOrder.plate}</p>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-volt/10 rounded-full border border-volt/20">
                                                <div className="w-2 h-2 bg-volt rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black text-volt uppercase">Charging</span>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div>
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-white/40">{units.toFixed(1)} kWh</span>
                                                <span className="text-white/40">{activeOrder.requested} kWh</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-volt rounded-full transition-all duration-1000"
                                                    style={{ width: `${(units / activeOrder.requested) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-black/20 rounded-xl p-3 text-center">
                                                <Clock size={14} className="text-white/30 mx-auto mb-1" />
                                                <p className="font-mono text-volt font-bold text-sm">{fmt(time)}</p>
                                                <p className="text-[9px] text-white/20 mt-0.5">Time</p>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 text-center">
                                                <Zap size={14} className="text-white/30 mx-auto mb-1" />
                                                <p className="font-mono text-white font-bold text-sm">{units.toFixed(1)}</p>
                                                <p className="text-[9px] text-white/20 mt-0.5">kWh</p>
                                            </div>
                                            <div className="bg-black/20 rounded-xl p-3 text-center">
                                                <Battery size={14} className="text-white/30 mx-auto mb-1" />
                                                <p className="font-mono text-volt font-bold text-sm">₹{(units * activeOrder.rate).toFixed(0)}</p>
                                                <p className="text-[9px] text-white/20 mt-0.5">Earned</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setShowCancelConfirm(true)}
                                            className="w-full py-3 border border-red-400/20 text-red-400/60 hover:bg-red-400/5 hover:border-red-400/40 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            End Session Early
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── AI ADVISOR TAB ── */}
                    {activeTab === 'ai' && (
                        <HostAIPanel hostName="Aaryan Sharma" currentRate={7.5} />
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR — History */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 bg-graphite flex flex-col">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                    <HistoryIcon size={16} className="text-white/30" />
                    <h2 className="font-bold text-sm text-white uppercase tracking-widest">Session History</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.map(h => (
                        <div key={h.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-white text-sm">{h.driver}</p>
                                <p className="text-white/30 text-xs">{h.units} kWh · {h.time}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-volt font-black text-base">₹{h.amount.toFixed(0)}</p>
                                <CheckCircle size={12} className="text-volt/50 ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RECEIPT MODAL */}
            {showReceipt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                    <div className="w-full max-w-[300px] border border-white/10 rounded-[32px] p-8 text-center bg-black shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/5">
                                <CheckCircle size={32} className="text-volt" />
                            </div>
                        </div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-bold text-white uppercase tracking-tight mb-1">
                            Session Complete<span className="text-volt">!</span>
                        </h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/40 text-xs mb-6">
                            ₹{lastEarnings} credited to your wallet
                        </p>
                        <button
                            onClick={() => setShowReceipt(false)}
                            style={{ fontFamily: "'Syne', sans-serif" }}
                            className="w-full py-4 bg-volt text-carbon font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* CANCEL CONFIRM */}
            {showCancelConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-[280px] bg-graphite border border-white/10 rounded-[28px] p-6 text-center">
                        <p className="font-bold text-white mb-2">End session early?</p>
                        <p className="text-white/40 text-xs mb-6">The driver will be billed for units charged so far.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60">
                                Cancel
                            </button>
                            <button
                                onClick={() => { handleCompletion(); setShowCancelConfirm(false); }}
                                className="flex-1 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-xs text-red-400 font-bold"
                            >
                                End Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ChatBot />
        </div>
    )
}