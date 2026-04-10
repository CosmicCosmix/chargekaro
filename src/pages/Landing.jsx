import { useNavigate } from 'react-router-dom'
import { Zap, Home, ChevronRight, Battery } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-carbon flex flex-col relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-volt/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-ember/5 blur-[100px] pointer-events-none" />

            {/* Nav */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-volt rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-carbon fill-carbon" />
                    </div>
                    <span className="font-display font-800 text-xl tracking-tight">
                        Charge<span className="text-volt">Karo</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30 font-body">
                    <span className="w-2 h-2 rounded-full bg-volt animate-pulse2" />
                    PRISMATIC 2K26 — Demo
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-12">
                <div className="inline-flex items-center gap-2 bg-steel border border-white/10 rounded-full px-4 py-2 text-xs text-white/50 mb-8 font-body">
                    <Battery size={12} className="text-volt" />
                    India's first P2P Home Charging Network
                </div>

                <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-none tracking-tighter mb-4">
                    Power<br />
                    <span className="text-volt">Shared.</span><br />
                    Range <span className="text-ember">Slayed.</span>
                </h1>

                <p className="text-white/40 font-body font-light text-lg max-w-md mt-4 mb-12 leading-relaxed">
                    Turn your home socket into a charging station.<br />
                    Or find one near you — right now.
                </p>

                {/* Split CTA */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                    <button
                        onClick={() => navigate('/driver')}
                        className="group flex-1 bg-volt hover:bg-volt/90 text-carbon font-display font-bold text-lg px-8 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(200,244,0,0.2)]"
                    >
                        <Zap size={20} className="fill-carbon" />
                        I'm an EV Driver
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => navigate('/host')}
                        className="group flex-1 bg-steel hover:bg-mist border border-white/10 text-white font-display font-bold text-lg px-8 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Home size={20} />
                        I'm a Host
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Stats footer */}
            <div className="relative z-10 border-t border-white/5 px-8 py-6">
                <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
                    {[
                        { val: "26K", label: "Existing Stations" },
                        { val: "1.3M", label: "Stations Needed" },
                        { val: "₹0", label: "Capex to Join" },
                    ].map((s) => (
                        <div key={s.label}>
                            <div className="font-display font-bold text-2xl text-volt">{s.val}</div>
                            <div className="text-xs text-white/30 font-body mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}