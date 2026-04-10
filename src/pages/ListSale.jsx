import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Zap, User, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react'
import ChatBot from '../components/HomeChatBot'
import { createHost } from '../api/hostApi';

export default function ListSale() {
    const navigate = useNavigate()
    const [profilePic, setProfilePic] = useState('https://dicebear.com')
    const handleSubmit = async () => {
        try {
            await createHost({
                name: "Aaryan Sharma",
                address: "Chennai",
                lat: 13.0827,
                lng: 80.2707,
                type: "Fast",
                rate,
                parking: parkingFee,
                rating: 4.5,
                available: true,
                connector: "Type 2",
                distance: "0 km",
                image: profilePic
            });

            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Failed to create host");
        }
    };
    // Local state for the sliders
    const [rate, setRate] = useState(7.5)
    const [parkingFee, setParkingFee] = useState(20)

    // Modal State
    const [showSuccess, setShowSuccess] = useState(false)

    return (
        <div className="min-h-screen bg-carbon text-white relative">
            {/* Header */}
            <div className="px-5 py-4 bg-graphite border-b border-white/5 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate('/host')} className="text-white/40 hover:text-white transition-colors">
                    <ChevronLeft size={20} /></button>
                <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold text-base">Profile & Node Settings</h1>
            </div>

            <div className="max-w-2xl mx-auto p-6 space-y-10">

                {/* PART 1: HOST PROFILE */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-volt">
                        <User size={18} />
                        <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold uppercase tracking-widest text-[10px]">Host Details</h3>
                    </div>
                    <div className="bg-graphite border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative">
                            <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-2 border-volt/20 p-1 object-cover bg-steel" />
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div className="space-y-1">
                                <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/40 uppercase font-bold">Display Name</label>
                                <input type="text" defaultValue="Aaryan Sharma" className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-volt/50 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/40 uppercase font-bold">Avatar URL</label>
                                <input type="text" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} className="w-full bg-steel border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white/60 focus:border-volt/50 outline-none font-mono" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* PART 2: YOUR SPACE */}
                <section className="space-y-6">
                    <div className="space-y-1">
                        <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-black text-white">Your Space</h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/40 text-sm">Update your charging node and vehicle compatibility.</p>
                    </div>
                    <div className="bg-graphite border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center gap-3 text-volt">
                            <Zap size={20} className="fill-volt" />
                            <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold uppercase tracking-widest text-xs">Node Capabilities</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/40 uppercase font-bold">Vehicle Support</label>
                                <select className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-volt/50 outline-none">
                                    <option>2W & 4W (Universal)</option>
                                    <option>2-Wheelers Only</option>
                                    <option>4-Wheelers Only</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/40 uppercase font-bold">Socket Standard</label>
                                <select className="w-full bg-steel border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-volt/50 outline-none">
                                    <option>15A Power Socket</option>
                                    <option>Type 2 AC Gun</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-white/40 uppercase font-bold">Station Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-volt" size={18} />
                                <input type="text" placeholder="Fetch current location..." className="w-full bg-steel border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-volt/50 outline-none" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* PART 3: DYNAMIC PRICING */}
                <section className="space-y-6">
                    <div className="bg-graphite border border-white/5 rounded-2xl p-5">
                        <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold text-sm mb-4">Dynamic Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex justify-between mb-3">
                                    <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-white/40">Per Unit Rate</label>
                                    <span style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold text-volt text-sm">₹{rate.toFixed(1)}/kWh</span>
                                </div>
                                <input type="range" min="3" max="15" step="0.5" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-[#C8F400] h-1.5 rounded-full cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-3">
                                    <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-white/40">Parking Fee</label>
                                    <span style={{ fontFamily: "'Syne', sans-serif" }} className="font-bold text-white/70 text-sm">₹{parkingFee}/session</span>
                                </div>
                                <input type="range" min="0" max="100" step="5" value={parkingFee} onChange={e => setParkingFee(parseInt(e.target.value))} className="w-full accent-[#C8F400] h-1.5 rounded-full cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Action */}
                <button onClick={handleSubmit}>
                    PUBLISH TO MAP
                </button>
            </div>

            {/* PROFESSIONAL SUCCESS MODAL (ROUNDED SQUARE UI) */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    <div
                        className="relative w-full max-w-[300px] border border-white/10 rounded-[32px] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500 ease-out"
                        style={{ background: '#000000' }}
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/5 shadow-inner">
                                <CheckCircle2 size={32} className="text-volt" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-bold text-white uppercase tracking-tight">
                                Success<span className="text-volt">!</span>
                            </h2>
                            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white/40 text-xs tracking-wide">
                                Map published
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/host')}
                            style={{ fontFamily: "'Syne', sans-serif" }}
                            className="w-full py-4 bg-volt text-carbon font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}

            <ChatBot />
        </div>
    )
}