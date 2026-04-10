import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, ChevronLeft, TrendingUp, Battery, DollarSign, Clock, Wifi, WifiOff, Bolt } from 'lucide-react'

const SESSION_TARGET = 45

export default function Host() {
    const navigate = useNavigate()
    const [online, setOnline] = useState(true)
    const [rate, setRate] = useState(7.5)
    const [parkingFee, setParkingFee] = useState(20)
    const [sessionTime, setSessionTime] = useState(0)
    const [unitsDelivered, setUnitsDelivered] = useState(0)

    // Live session simulation
    useEffect(() => {
        if (!online) return
        const t = setInterval(() => {
            setSessionTime(p => p + 1)
            setUnitsDelivered(p => parseFloat((p + 0.003).toFixed(3)))
        }, 1000)
        return () => clearInterval(t)
    }, [online])

    const sessionEarning = (unitsDelivered * rate).toFixed(2)
    const subsidyUsed = 142.4
    const subsidyMax = 200
    const subsidyPct = Math.round((subsidyUsed / subsidyMax) * 100)
    const walletBalance = 340.5
    const monthlyEarning = 2840

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    return (
        <div className="min-h-screen bg-carbon">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-graphite border-b border-white/5">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                    <span className="font-body text-sm">Back</span>
                </button>
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-volt fill-volt" />
                    <span className="font-display font-bold text-base">Host Dashboard</span>
                </div>
                {/* Online Toggle */}
                <button
                    onClick={() => setOnline(p => !p)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-bold transition-all
            ${online ? 'bg-volt/20 text-volt border border-volt/30' : 'bg-steel text-white/30 border border-white/10'}`}
                >
                    {online ? <Wifi size={12} /> : <WifiOff size={12} />}
                    {online ? 'Online' : 'Offline'}
                </button>
            </div>

            <div className="max-w-4xl mx-auto p-5 space-y-4">
                {/* Status Banner */}
                {online && (
                    <div className="bg-volt/10 border border-volt/20 rounded-2xl px-5 py-3 flex items-center gap-3 animate-fade-in">
                        <div className="w-2 h-2 rounded-full bg-volt animate-pulse2" />
                        <span className="font-body text-sm text-volt/80">Your socket is live — accepting EV drivers nearby</span>
                    </div>
                )}

                {/* Top KPIs */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: DollarSign, label: 'This Month', val: `₹${monthlyEarning}`, color: 'text-volt' },
                        { icon: Battery, label: 'Wallet Balance', val: `₹${walletBalance}`, color: 'text-white' },
                        { icon: TrendingUp, label: 'Sessions Done', val: '38', color: 'text-ember' },
                    ].map(({ icon: Icon, label, val, color }) => (
                        <div key={label} className="bg-graphite border border-white/5 rounded-2xl p-4">
                            <Icon size={16} className={`${color} mb-2 opacity-60`} />
                            <div className={`font-display font-bold text-xl ${color}`}>{val}</div>
                            <div className="text-[11px] text-white/30 font-body mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Active Session */}
                    <div className="bg-graphite border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-sm">Active Session</h3>
                            {online ? (
                                <span className="text-[10px] bg-volt/10 text-volt border border-volt/20 px-2 py-1 rounded-full font-display">LIVE</span>
                            ) : (
                                <span className="text-[10px] bg-steel text-white/30 border border-white/10 px-2 py-1 rounded-full font-display">PAUSED</span>
                            )}
                        </div>

                        {online ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-steel flex items-center justify-center">
                                        <Zap size={16} className="text-volt fill-volt" />
                                    </div>
                                    <div>
                                        <div className="font-display font-semibold text-sm">Tata Nexon EV</div>
                                        <div className="text-[11px] text-white/40">TN 09 AB 1234</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: 'Duration', val: fmt(sessionTime), icon: Clock },
                                        { label: 'kWh Delivered', val: unitsDelivered.toFixed(3), icon: Battery },
                                        { label: 'Earned', val: `₹${sessionEarning}`, icon: DollarSign },
                                    ].map(({ label, val, icon: Icon }) => (
                                        <div key={label} className="bg-steel rounded-xl p-3 text-center">
                                            <div className="font-display font-bold text-sm text-volt">{val}</div>
                                            <div className="text-[10px] text-white/30 mt-0.5">{label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Charge progress bar */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                                        <span>Session Progress</span>
                                        <span>{Math.min(Math.round((sessionTime / SESSION_TARGET / 60) * 100), 100)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-steel rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-volt rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((sessionTime / (SESSION_TARGET * 60)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-white/20">
                                <WifiOff size={32} className="mb-3" />
                                <span className="font-body text-sm">Go online to accept sessions</span>
                            </div>
                        )}
                    </div>

                    {/* Subsidy Tracker */}
                    <div className="bg-graphite border border-white/5 rounded-2xl p-5">
                        <h3 className="font-display font-bold text-sm mb-4">Subsidy Tracker</h3>
                        <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-white/40 font-body">Units Used This Month</span>
                                <span className="font-display font-bold text-volt">{subsidyUsed} / {subsidyMax} kWh</span>
                            </div>
                            <div className="w-full h-3 bg-steel rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${subsidyPct}%`,
                                        background: subsidyPct > 80 ? '#FF4D1C' : '#C8F400'
                                    }}
                                />
                            </div>
                            <div className="text-[10px] text-white/20 mt-1.5">{subsidyPct}% of free quota used</div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Shared to Drivers</span>
                                <span className="text-white/70 font-display font-semibold">68.2 kWh</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Home Usage</span>
                                <span className="text-white/70 font-display font-semibold">74.2 kWh</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Remaining Free Units</span>
                                <span className="text-volt font-display font-bold">{(subsidyMax - subsidyUsed).toFixed(1)} kWh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Controls */}
                <div className="bg-graphite border border-white/5 rounded-2xl p-5">
                    <h3 className="font-display font-bold text-sm mb-4">Dynamic Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="text-xs text-white/40 font-body">Per Unit Rate</label>
                                <span className="font-display font-bold text-volt text-sm">₹{rate.toFixed(1)}/kWh</span>
                            </div>
                            <input
                                type="range" min="3" max="15" step="0.5" value={rate}
                                onChange={e => setRate(parseFloat(e.target.value))}
                                className="w-full accent-[#C8F400] h-1.5 rounded-full"
                            />
                            <div className="flex justify-between text-[10px] text-white/20 mt-1.5">
                                <span>₹3 (Low)</span><span>₹15 (Peak)</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="text-xs text-white/40 font-body">Parking Fee</label>
                                <span className="font-display font-bold text-white/70 text-sm">₹{parkingFee}/session</span>
                            </div>
                            <input
                                type="range" min="0" max="100" step="5" value={parkingFee}
                                onChange={e => setParkingFee(parseInt(e.target.value))}
                                className="w-full accent-[#C8F400] h-1.5 rounded-full"
                            />
                            <div className="flex justify-between text-[10px] text-white/20 mt-1.5">
                                <span>₹0 (Free)</span><span>₹100 (Premium)</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-steel rounded-xl flex items-center justify-between">
                        <span className="text-xs text-white/40 font-body">Estimated hourly earning at current rate</span>
                        <span className="font-display font-bold text-volt">₹{((rate * 3.3) + parkingFee).toFixed(0)}/hr</span>
                    </div>
                </div>
            </div>
        </div>
    )
}