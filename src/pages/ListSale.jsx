import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Zap, Info, Camera, ShieldCheck } from 'lucide-react'

export default function ListSale() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <div className="px-5 py-4 bg-graphite border-b border-white/5 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/host')} className="text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={20}/></button>
        <h1 className="font-display font-bold text-base">New Charging Listing</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Intro Text */}
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black text-white">Set up your Station</h2>
          <p className="text-white/40 text-sm">Enter your charger details to start appearing on the Driver's map.</p>
        </div>

        {/* Section 1: Hardware Specs */}
        <div className="bg-graphite border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 text-volt">
            <Zap size={20} className="fill-volt" />
            <h3 className="font-display font-bold uppercase tracking-widest text-xs">Hardware Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold">Plug Connector</label>
              <select className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-volt/50 outline-none">
                <option>Type 2 (Universal)</option>
                <option>15A Domestic (Home Plug)</option>
                <option>CCS2 (DC Fast)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold">Max Power (kW)</label>
              <input type="number" placeholder="7.4" className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-volt/50 outline-none" />
            </div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="bg-graphite border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 text-volt">
            <MapPin size={20} />
            <h3 className="font-display font-bold uppercase tracking-widest text-xs">Location & Access</h3>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Full Address" className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-volt/50 outline-none" />
            <div className="flex items-center gap-2 p-3 bg-steel/50 rounded-xl text-white/40 border border-white/5">
              <Info size={14} />
              <p className="text-[10px]">Drivers will only see your precise location after you accept a booking.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => { alert('Listing Published!'); navigate('/host'); }}
          className="w-full bg-volt text-carbon font-display font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(200,244,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          PUBLISH TO MAP
        </button>
      </div>
    </div>
  )
}
