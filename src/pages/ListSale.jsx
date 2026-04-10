import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Zap, User, Camera, ShieldCheck } from 'lucide-react'

export default function ListSale() {
  const navigate = useNavigate()
  const [profilePic, setProfilePic] = useState('https://dicebear.com')
  
  // Local state for the sliders in the Profile view
  const [rate, setRate] = useState(7.5)
  const [parkingFee, setParkingFee] = useState(20)

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <div className="px-5 py-4 bg-graphite border-b border-white/5 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/host')} className="text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={20}/></button>
        <h1 className="font-display font-bold text-base">Profile & Node Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        
        {/* PART 1: HOST PROFILE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-volt">
            <User size={18} />
            <h3 className="font-display font-bold uppercase tracking-widest text-[10px]">Host Details</h3>
          </div>
          <div className="bg-graphite border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative">
              <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-2 border-volt/20 p-1 object-cover bg-steel" />
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold">Display Name</label>
                <input type="text" defaultValue="Aaryan Sharma" className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-volt/50 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase font-bold">Avatar URL</label>
                <input type="text" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} className="w-full bg-steel border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white/60 focus:border-volt/50 outline-none font-mono" />
              </div>
            </div>
          </div>
        </section>

        {/* PART 2: YOUR SPACE */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-black text-white">Your Space</h2>
            <p className="text-white/40 text-sm">Update your charging node and vehicle compatibility.</p>
          </div>
          <div className="bg-graphite border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-volt">
              <Zap size={20} className="fill-volt" />
              <h3 className="font-display font-bold uppercase tracking-widest text-xs">Node Capabilities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Vehicle Support</label>
                <select className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-volt/50 outline-none">
                  <option>2W & 4W (Universal)</option>
                  <option>2-Wheelers Only</option>
                  <option>4-Wheelers Only</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Socket Standard</label>
                <select className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-volt/50 outline-none">
                  <option>15A Power Socket</option>
                  <option>Type 2 AC Gun</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold">Station Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-volt" size={18} />
                <input type="text" placeholder="Fetch current location..." className="w-full bg-steel border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-volt/50 outline-none" />
              </div>
            </div>
          </div>
        </section>

        {/* PART 3: DYNAMIC PRICING (Newly Added below Your Space) */}
        <section className="space-y-6">
          <div className="bg-graphite border border-white/5 rounded-2xl p-5">
            <h3 className="font-display font-bold text-sm mb-4">Dynamic Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs text-white/40 font-body">Per Unit Rate</label>
                  <span className="font-display font-bold text-volt text-sm">₹{rate.toFixed(1)}/kWh</span>
                </div>
                <input type="range" min="3" max="15" step="0.5" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-[#C8F400] h-1.5 rounded-full cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs text-white/40 font-body">Parking Fee</label>
                  <span className="font-display font-bold text-white/70 text-sm">₹{parkingFee}/session</span>
                </div>
                <input type="range" min="0" max="100" step="5" value={parkingFee} onChange={e => setParkingFee(parseInt(e.target.value))} className="w-full accent-[#C8F400] h-1.5 rounded-full cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        {/* Final Action */}
        <button 
          onClick={() => { alert('Profile and Space updated!'); navigate('/host'); }} 
          className="w-full bg-volt text-carbon font-display font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(200,244,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          PUBLISH TO MAP
        </button>
      </div>
    </div>
  )
}
