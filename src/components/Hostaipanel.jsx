import { useState } from 'react'
import { Sparkles, TrendingUp, Zap, Clock, Brain, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react'
import { fetchHostInsights, fetchSmartPricing } from '../api/aiApi'

// ── Mock session data (replace with real Supabase fetch in production) ─────────
const MOCK_SESSIONS = [
    { dayOfWeek: "Monday", hour: 8, driverName: "Rahul S.", unitsKWh: 5.2, earned: 39, durationMinutes: 28 },
    { dayOfWeek: "Monday", hour: 19, driverName: "Priya K.", unitsKWh: 8.1, earned: 61, durationMinutes: 44 },
    { dayOfWeek: "Tuesday", hour: 7, driverName: "Anish M.", unitsKWh: 12, earned: 90, durationMinutes: 65 },
    { dayOfWeek: "Wednesday", hour: 20, driverName: "Sanya V.", unitsKWh: 4.0, earned: 30, durationMinutes: 22 },
    { dayOfWeek: "Thursday", hour: 18, driverName: "Karthik R.", unitsKWh: 15, earned: 113, durationMinutes: 81 },
    { dayOfWeek: "Friday", hour: 9, driverName: "Meera N.", unitsKWh: 6.5, earned: 49, durationMinutes: 35 },
    { dayOfWeek: "Saturday", hour: 11, driverName: "Amit V.", unitsKWh: 20, earned: 150, durationMinutes: 108 },
    { dayOfWeek: "Saturday", hour: 16, driverName: "Sneha L.", unitsKWh: 12, earned: 84, durationMinutes: 65 },
    { dayOfWeek: "Sunday", hour: 10, driverName: "Rajesh K.", unitsKWh: 15, earned: 113, durationMinutes: 81 },
    { dayOfWeek: "Sunday", hour: 14, driverName: "Pooja B.", unitsKWh: 9.5, earned: 71, durationMinutes: 51 },
]

const ICON_MAP = {
    revenue: <TrendingUp size={14} className="text-volt" />,
    timing: <Clock size={14} className="text-blue-400" />,
    demand: <Zap size={14} className="text-orange-400" />,
    tip: <Brain size={14} className="text-purple-400" />,
}

const COLOR_MAP = {
    revenue: 'border-volt/20 bg-volt/5',
    timing: 'border-blue-400/20 bg-blue-400/5',
    demand: 'border-orange-400/20 bg-orange-400/5',
    tip: 'border-purple-400/20 bg-purple-400/5',
}

export default function HostAIPanel({ hostName = "Aaryan Sharma", currentRate = 7.5 }) {
    const [insights, setInsights] = useState(null)
    const [pricing, setPricing] = useState(null)
    const [loadingInsights, setLoadingInsights] = useState(false)
    const [loadingPricing, setLoadingPricing] = useState(false)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('insights') // 'insights' | 'pricing'

    const totalEarned = MOCK_SESSIONS.reduce((s, x) => s + x.earned, 0)
    const totalUnits = MOCK_SESSIONS.reduce((s, x) => s + x.unitsKWh, 0)
    const avgUnits = totalUnits / MOCK_SESSIONS.length

    async function loadInsights() {
        setLoadingInsights(true)
        setError(null)
        try {
            const data = await fetchHostInsights(hostName, currentRate, MOCK_SESSIONS)
            setInsights(data)
        } catch (e) {
            setError('Could not reach AI service. Check your connection.')
        } finally {
            setLoadingInsights(false)
        }
    }

    async function loadPricing() {
        setLoadingPricing(true)
        setError(null)
        try {
            const data = await fetchSmartPricing(currentRate, MOCK_SESSIONS.length, avgUnits)
            setPricing(data)
        } catch (e) {
            setError('Could not reach AI service. Check your connection.')
        } finally {
            setLoadingPricing(false)
        }
    }

    return (
        <div className="bg-graphite border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-volt/10 border border-volt/20 flex items-center justify-center">
                        <Sparkles size={14} className="text-volt" />
                    </div>
                    <div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold text-sm text-white uppercase tracking-wider">
                            AI Advisor
                        </h3>
                        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/30">
                            Powered by Gemini · {MOCK_SESSIONS.length} sessions analysed
                        </p>
                    </div>
                </div>
                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-4 text-right">
                    <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold">30d Earned</p>
                        <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-volt font-black text-sm">₹{totalEarned}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold">Units Sold</p>
                        <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-white font-black text-sm">{totalUnits.toFixed(1)} kWh</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
                {['insights', 'pricing'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'text-volt border-b-2 border-volt bg-volt/5'
                                : 'text-white/30 hover:text-white/60'
                            }`}
                    >
                        {tab === 'insights' ? '✦ Gemini Insights' : '⚡ ML Smart Pricing'}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {error && (
                    <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                        <AlertTriangle size={14} />
                        {error}
                    </div>
                )}

                {/* ── INSIGHTS TAB ── */}
                {activeTab === 'insights' && (
                    <div className="space-y-4">
                        {!insights && !loadingInsights && (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 mx-auto bg-volt/5 border border-volt/10 rounded-2xl flex items-center justify-center">
                                    <Brain size={24} className="text-volt/50" />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-white font-bold text-sm">
                                        Analyse Your Station Performance
                                    </p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/30 text-xs mt-1">
                                        Gemini AI will analyse your session history and surface actionable revenue insights.
                                    </p>
                                </div>
                                <button
                                    onClick={loadInsights}
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-volt text-carbon text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all"
                                >
                                    <Sparkles size={13} />
                                    Generate AI Insights
                                </button>
                            </div>
                        )}

                        {loadingInsights && (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-center text-xs text-white/30 animate-pulse">
                                    Gemini is analysing your data...
                                </p>
                            </div>
                        )}

                        {insights && !loadingInsights && (
                            <>
                                <div className="space-y-3">
                                    {insights.map((insight, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-4 p-4 rounded-xl border ${COLOR_MAP[insight.type] || 'border-white/10 bg-white/5'}`}
                                        >
                                            <div className="mt-0.5 w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                                                {ICON_MAP[insight.type] || <Sparkles size={14} className="text-volt" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-white font-bold text-xs uppercase tracking-wide mb-1">
                                                    {insight.title}
                                                </p>
                                                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/50 text-xs leading-relaxed">
                                                    {insight.detail}
                                                </p>
                                            </div>
                                            <ChevronRight size={14} className="text-white/20 flex-shrink-0 mt-1" />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={loadInsights}
                                    className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
                                >
                                    <RefreshCw size={12} />
                                    Regenerate
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ── SMART PRICING TAB ── */}
                {activeTab === 'pricing' && (
                    <div className="space-y-4">
                        {!pricing && !loadingPricing && (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 mx-auto bg-volt/5 border border-volt/10 rounded-2xl flex items-center justify-center">
                                    <TrendingUp size={24} className="text-volt/50" />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-white font-bold text-sm">
                                        ML Pricing Optimiser
                                    </p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/30 text-xs mt-1">
                                        Our demand-weighted algorithm analyses peak hours, session volume, and local trends to suggest the optimal rate.
                                    </p>
                                </div>
                                <button
                                    onClick={loadPricing}
                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-volt text-carbon text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all"
                                >
                                    <Zap size={13} />
                                    Run ML Analysis
                                </button>
                            </div>
                        )}

                        {loadingPricing && (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        )}

                        {pricing && !loadingPricing && (
                            <div className="space-y-4">
                                {/* Main recommendation card */}
                                <div className={`p-5 rounded-2xl border ${pricing.isSurge ? 'border-orange-400/30 bg-orange-400/5' : 'border-volt/20 bg-volt/5'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-white/40 uppercase font-bold">
                                            Recommended Rate
                                        </p>
                                        {pricing.isSurge && (
                                            <span className="text-[9px] px-2 py-0.5 bg-orange-400/20 text-orange-400 border border-orange-400/20 rounded-full font-bold uppercase tracking-wider">
                                                Surge
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-end gap-3 mb-3">
                                        <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl font-black text-volt">
                                            ₹{pricing.suggestedRate}
                                        </p>
                                        <p className="text-white/30 text-sm mb-1">/kWh</p>
                                        <p className="text-white/20 text-xs mb-1 line-through">was ₹{currentRate}</p>
                                    </div>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/50 text-xs leading-relaxed">
                                        {pricing.reason}
                                    </p>
                                </div>

                                {/* Confidence + Projection */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                                        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/30 uppercase font-bold mb-2">Model Confidence</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-volt rounded-full transition-all duration-1000"
                                                    style={{ width: `${pricing.confidencePercent}%` }}
                                                />
                                            </div>
                                            <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-volt font-black text-sm">
                                                {pricing.confidencePercent}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                                        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/30 uppercase font-bold mb-1">Projected Monthly</p>
                                        <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-white font-black text-lg">₹{pricing.projectedMonthlyEarnings}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={loadPricing}
                                    className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
                                >
                                    <RefreshCw size={12} />
                                    Re-run analysis
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}