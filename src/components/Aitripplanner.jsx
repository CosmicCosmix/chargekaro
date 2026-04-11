import { useState } from 'react'
import { Navigation, Sparkles, Battery, MapPin, Zap, Star, ChevronDown, ChevronUp, Loader2, AlertTriangle } from 'lucide-react'
import { fetchTripPlan, fetchRankedStations } from '../api/aiApi'

// Badge color map
const BADGE_STYLES = {
    'Best Match': 'bg-volt/15 text-volt border-volt/30',
    'Good Option': 'bg-blue-400/15 text-blue-300 border-blue-400/30',
    'Available': 'bg-white/5 text-white/40 border-white/10',
}

export default function AITripPlanner({ stations = [], userLocation = { lat: 13.0827, lng: 80.2707 } }) {
    const [activeTab, setActiveTab] = useState('ranker') // 'ranker' | 'planner'

    // ── Ranker state ───────────────────────────────────────────────────────────
    const [rankedStations, setRankedStations] = useState(null)
    const [loadingRanker, setLoadingRanker] = useState(false)
    const [connector, setConnector] = useState('Type 2')
    const [budget, setBudget] = useState(12)
    const [expandedId, setExpandedId] = useState(null)

    // ── Planner state ──────────────────────────────────────────────────────────
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [battery, setBattery] = useState(60)
    const [range, setRange] = useState(150)
    const [tripPlan, setTripPlan] = useState(null)
    const [loadingPlan, setLoadingPlan] = useState(false)
    const [error, setError] = useState(null)

    // Add distance to each station (Haversine)
    function haversine(lat1, lng1, lat2, lng2) {
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLng = (lng2 - lng1) * Math.PI / 180
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }

    function stationsWithDistance() {
        return stations.map(s => ({
            ...s,
            distanceKm: s.lat && s.lng
                ? parseFloat(haversine(userLocation.lat, userLocation.lng, s.lat, s.lng).toFixed(1))
                : 99,
        }))
    }

    async function runRanker() {
        setLoadingRanker(true)
        setError(null)
        setRankedStations(null)
        try {
            const enriched = stationsWithDistance()
            const scores = await fetchRankedStations(enriched, connector, budget)
            // Merge scores with station data
            const merged = scores.map(score => ({
                ...score,
                station: enriched.find(s => s.id === score.stationId),
            }))
            setRankedStations(merged)
        } catch (e) {
            setError('ML ranker unavailable. Please try again.')
        } finally {
            setLoadingRanker(false)
        }
    }

    async function runPlanner() {
        if (!from.trim() || !to.trim()) return
        setLoadingPlan(true)
        setError(null)
        setTripPlan(null)
        try {
            const enriched = stationsWithDistance()
            const plan = await fetchTripPlan(from, to, battery, range, enriched)
            setTripPlan(plan)
        } catch (e) {
            setError('Gemini trip planner unavailable. Please try again.')
        } finally {
            setLoadingPlan(false)
        }
    }

    return (
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
                    <Sparkles size={13} className="text-lime-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-white tracking-tight">AI Charge Assistant</h3>
                    <p className="text-[10px] text-neutral-500">Gemini · ML-Powered</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
                {[
                    { id: 'ranker', label: '⚡ Smart Ranker' },
                    { id: 'planner', label: '✦ Trip Planner' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'text-lime-400 border-b-2 border-lime-400 bg-lime-400/5'
                                : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mx-4 mt-4 flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px]">
                    <AlertTriangle size={12} />
                    {error}
                </div>
            )}

            {/* ── ML STATION RANKER ── */}
            {activeTab === 'ranker' && (
                <div className="p-4 space-y-4">
                    <p className="text-[10px] text-neutral-500 leading-relaxed">
                        Our ML model scores stations using distance, availability, pricing, connector compatibility, and user ratings — then ranks them for you.
                    </p>

                    {/* Preferences */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-neutral-500 uppercase font-bold">Connector</label>
                            <select
                                value={connector}
                                onChange={e => setConnector(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-lime-400/50 outline-none"
                            >
                                <option>Type 2</option>
                                <option>15A Power Socket</option>
                                <option>CCS</option>
                                <option>CHAdeMO</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-neutral-500 uppercase font-bold">
                                Max ₹{budget}/kWh
                            </label>
                            <input
                                type="range" min="5" max="20" step="0.5"
                                value={budget}
                                onChange={e => setBudget(parseFloat(e.target.value))}
                                className="w-full accent-lime-400 h-1.5 rounded-full cursor-pointer mt-3"
                            />
                        </div>
                    </div>

                    <button
                        onClick={runRanker}
                        disabled={loadingRanker || stations.length === 0}
                        className="w-full py-2.5 bg-lime-400 text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-lime-300 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                        {loadingRanker
                            ? <><Loader2 size={12} className="animate-spin" /> Ranking Stations...</>
                            : <><Zap size={12} /> Rank {stations.length} Stations</>
                        }
                    </button>

                    {/* Results */}
                    {rankedStations && (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {rankedStations.map((item, i) => {
                                if (!item.station) return null
                                const s = item.station
                                const isExpanded = expandedId === item.stationId
                                return (
                                    <div
                                        key={item.stationId}
                                        className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden transition-all"
                                    >
                                        <div
                                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5"
                                            onClick={() => setExpandedId(isExpanded ? null : item.stationId)}
                                        >
                                            {/* Rank badge */}
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${i === 0 ? 'bg-lime-400 text-black' : 'bg-white/10 text-white/40'
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-semibold text-white truncate">{s.name}</p>
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-md border font-bold uppercase tracking-wide flex-shrink-0 ${BADGE_STYLES[item.badge] || BADGE_STYLES['Available']}`}>
                                                        {item.badge}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className="text-[10px] text-neutral-500">₹{s.rate}/kWh</span>
                                                    <span className="text-[10px] text-neutral-500">{s.distanceKm} km</span>
                                                    <span className="text-[10px] text-lime-400 font-bold">{item.score}pts</span>
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronUp size={12} className="text-white/30" /> : <ChevronDown size={12} className="text-white/30" />}
                                        </div>

                                        {/* Expanded score breakdown */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 space-y-1.5 border-t border-white/5 pt-3">
                                                {[
                                                    ['Distance', item.breakdown.distance],
                                                    ['Rating', item.breakdown.rating],
                                                    ['Availability', item.breakdown.availability],
                                                    ['Price', item.breakdown.price],
                                                    ['Connector', item.breakdown.connector],
                                                ].map(([label, val]) => (
                                                    <div key={label} className="flex items-center gap-2">
                                                        <span className="text-[9px] text-neutral-600 w-20 flex-shrink-0">{label}</span>
                                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-lime-400/60 rounded-full"
                                                                style={{ width: `${val}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[9px] text-neutral-500 w-6 text-right">{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── AI TRIP PLANNER ── */}
            {activeTab === 'planner' && (
                <div className="p-4 space-y-4">
                    <p className="text-[10px] text-neutral-500 leading-relaxed">
                        Enter your destination and Gemini will pick the best charging stops along your route.
                    </p>

                    {/* From / To */}
                    <div className="space-y-2">
                        <div className="relative">
                            <MapPin size={12} className="absolute left-3 top-3 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="From (e.g. Chennai)"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-lime-400/50 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Navigation size={12} className="absolute left-3 top-3 text-lime-400" />
                            <input
                                type="text"
                                placeholder="To (e.g. Bengaluru)"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-lime-400/50 outline-none"
                            />
                        </div>
                    </div>

                    {/* Battery & Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
                                <Battery size={10} /> Battery: {battery}%
                            </label>
                            <input
                                type="range" min="10" max="100" step="5"
                                value={battery}
                                onChange={e => setBattery(parseInt(e.target.value))}
                                className="w-full accent-lime-400 h-1.5 rounded-full cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-neutral-500 uppercase font-bold">
                                Range: {range} km
                            </label>
                            <input
                                type="range" min="50" max="400" step="10"
                                value={range}
                                onChange={e => setRange(parseInt(e.target.value))}
                                className="w-full accent-lime-400 h-1.5 rounded-full cursor-pointer"
                            />
                        </div>
                    </div>

                    <button
                        onClick={runPlanner}
                        disabled={loadingPlan || !from.trim() || !to.trim()}
                        className="w-full py-2.5 bg-lime-400 text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-lime-300 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                        {loadingPlan
                            ? <><Loader2 size={12} className="animate-spin" /> Gemini Planning...</>
                            : <><Sparkles size={12} /> Plan My Trip</>
                        }
                    </button>

                    {/* Trip Plan Results */}
                    {tripPlan && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            {/* Stops */}
                            <div className="bg-black/30 border border-lime-400/20 rounded-2xl p-4 space-y-3">
                                <p className="text-[10px] text-lime-400 uppercase font-bold tracking-widest">Recommended Stops</p>
                                {(tripPlan.stops || []).map((stopId, i) => {
                                    const s = stations.find(st => st.id === stopId)
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-[9px] font-black text-lime-400">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-xs text-white font-medium">{s?.name || `Station #${stopId}`}</p>
                                                <p className="text-[10px] text-neutral-500">{s?.address} · ₹{s?.rate}/kWh</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Reasoning */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-neutral-500 leading-relaxed">
                                    <span className="text-white/60 font-semibold">AI Reasoning: </span>
                                    {tripPlan.reasoning}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-neutral-600 uppercase font-bold mb-1">Est. Cost</p>
                                    <p className="text-lime-400 font-black text-sm">₹{tripPlan.estimatedCost}</p>
                                </div>
                                <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-neutral-600 uppercase font-bold mb-1">Pro Tip</p>
                                    <p className="text-[9px] text-neutral-400 leading-relaxed">{tripPlan.tip}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}