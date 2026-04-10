import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Star, Navigation, Filter, X, ChevronLeft, Bolt, Clock, CheckCircle } from 'lucide-react'
import { hosts } from '../data/hosts'
import BookingModal from '../components/BookingModal'

export default function Driver() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)
    const [booking, setBooking] = useState(null)
    const [filter, setFilter] = useState('All')

    const types = ['All', 'Fast', 'Standard']
    const filtered = filter === 'All' ? hosts : hosts.filter(h => h.type === filter)

    return (
        <div className="h-screen flex flex-col bg-carbon overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 bg-graphite border-b border-white/5 z-20 shrink-0">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                    <span className="font-body text-sm">Back</span>
                </button>
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-volt fill-volt" />
                    <span className="font-display font-bold text-base">ChargeKaro</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <Navigation size={14} className="text-volt" />
                    Chennai
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Map Area */}
                <div className="flex-1 relative map-grid bg-carbon overflow-hidden">
                    {/* Road lines decoration */}
                    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#fff" strokeWidth="6" />
                        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#fff" strokeWidth="3" />
                        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#fff" strokeWidth="4" />
                        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#fff" strokeWidth="3" />
                        <line x1="15%" y1="0" x2="50%" y2="60%" stroke="#fff" strokeWidth="2" />
                    </svg>

                    {/* Host Pins */}
                    {hosts.map((h) => (
                        <button
                            key={h.id}
                            onClick={() => setSelected(h.id === selected ? null : h.id)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10"
                            style={{ left: `${h.lng}%`, top: `${h.lat}%` }}
                        >
                            <div className={`relative flex flex-col items-center`}>
                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all
                  ${!h.available ? 'bg-mist border-white/20 opacity-50' :
                                        h.id === selected ? 'bg-volt border-volt scale-125 shadow-[0_0_20px_rgba(200,244,0,0.6)]' :
                                            h.type === 'Fast' ? 'bg-ember border-ember shadow-[0_0_12px_rgba(255,77,28,0.4)]' :
                                                'bg-steel border-volt/50'}`}
                                >
                                    <Zap size={14} className={h.id === selected ? 'text-carbon fill-carbon' : 'text-volt fill-volt'} />
                                </div>
                                {h.available && (
                                    <div className={`text-[9px] font-display font-bold mt-1 px-2 py-0.5 rounded-full
                    ${h.id === selected ? 'bg-volt text-carbon' : 'bg-graphite text-white/70 border border-white/10'}`}>
                                        ₹{h.rate}/u
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}

                    {/* Map label */}
                    <div className="absolute bottom-4 left-4 text-[10px] text-white/20 font-body">
                        © ChargeKaro · Simulated Map · Chennai
                    </div>

                    {/* Legend */}
                    <div className="absolute top-4 left-4 bg-graphite/90 border border-white/10 rounded-xl p-3 space-y-2 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <div className="w-3 h-3 rounded-full bg-ember" /> Fast Charger
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <div className="w-3 h-3 rounded-full bg-steel border border-volt/50" /> Standard
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <div className="w-3 h-3 rounded-full bg-mist opacity-50" /> Unavailable
                        </div>
                    </div>
                </div>

                {/* Host Panel */}
                <div className="w-80 bg-graphite border-l border-white/5 flex flex-col overflow-hidden">
                    <div className="px-4 pt-4 pb-3 border-b border-white/5 shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-display font-bold text-base">Nearby Chargers</h2>
                            <div className="flex items-center gap-1 text-xs text-white/40">
                                <CheckCircle size={12} className="text-volt" />
                                {hosts.filter(h => h.available).length} available
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {types.map(t => (
                                <button key={t}
                                    onClick={() => setFilter(t)}
                                    className={`flex-1 text-xs font-display font-semibold py-1.5 rounded-lg transition-all
                    ${filter === t ? 'bg-volt text-carbon' : 'bg-steel text-white/40 hover:text-white/70'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filtered.map((h, i) => (
                            <button
                                key={h.id}
                                onClick={() => setSelected(h.id === selected ? null : h.id)}
                                className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all duration-150 animate-slide-up
                  ${h.id === selected ? 'bg-volt/10 border-l-2 border-l-volt' : 'hover:bg-steel/50'}`}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-steel shrink-0">
                                        <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="font-display font-semibold text-sm truncate">{h.name}</span>
                                            <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full
                        ${h.type === 'Fast' ? 'bg-ember/20 text-ember' : 'bg-volt/10 text-volt'}`}>
                                                {h.type}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-white/40 font-body truncate mb-1.5">{h.address}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-volt font-display font-bold text-sm">₹{h.rate}<span className="text-white/30 font-normal text-[10px]">/unit</span></span>
                                            {h.parking > 0 && <span className="text-white/30 text-[10px]">+₹{h.parking} park</span>}
                                            <span className="text-white/30 text-[10px] ml-auto">{h.distance}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-[10px] text-white/40">{h.rating}</span>
                                            <span className="text-[10px] text-white/20">·</span>
                                            <span className="text-[10px] text-white/40">{h.connector}</span>
                                            {!h.available && <span className="text-[10px] text-ember ml-auto">Busy</span>}
                                            {h.available && h.id === selected && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setBooking(h) }}
                                                    className="ml-auto text-[10px] bg-volt text-carbon font-display font-bold px-2 py-0.5 rounded-full hover:bg-volt/80 transition-colors"
                                                >
                                                    Book Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {booking && <BookingModal host={booking} onClose={() => setBooking(null)} />}
        </div>
    )
}