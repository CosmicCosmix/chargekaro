import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Home, ChevronRight, Activity, ShieldCheck, Globe, Star } from "lucide-react";

// Professional Icons using Lucide for consistency
const BoltIcon = ({ className }) => <Zap className={className} size={18} />;

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-[#FAFAFA] overflow-hidden flex flex-col relative font-sans">

            {/* --- AMBIENT FURNISHING --- */}
            {/* Decorative Gradient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF85]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#FF3B3B]/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Subtle Grid Overlay to make it look "Engineered" */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* RIGHT SIDE ACCENT LINE */}
            <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#00FF85]/40 to-transparent opacity-50 hidden md:block" />

            {/* --- NAVBAR --- */}
            <nav className="relative z-50 flex justify-between items-center px-8 md:px-12 py-5 border-b border-white/5 backdrop-blur-sm bg-black/20">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-1.5 bg-[#00FF85] rounded-md transition-transform group-hover:rotate-12">
                        <Zap size={16} className="text-black fill-black" />
                    </div>
                    <span className="tracking-[0.3em] font-bold text-sm">CHARGE<span className="text-[#00FF85]">KARO</span></span>
                </div>

                <div className="hidden lg:flex gap-8 text-[9px] tracking-[0.25em] items-center font-bold text-white/40">
                    <span className="hover:text-white transition-colors cursor-default">MONETIZE YOUR HOME CHARGER</span>
                    <span className="text-[#00FF85]/30">•</span>
                    <span className="hover:text-white transition-colors cursor-default">ACCESS A NATION-WIDE NETWORK</span>
                    <span className="text-[#00FF85]/30">•</span>
                    <span className="hover:text-white transition-colors cursor-default">SUSTAINABLE ENERGY, DECENTRALISED.</span>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-[#00FF85]/20 bg-[#00FF85]/5">
                    <Activity size={12} className="text-[#00FF85] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest text-[#00FF85]">26,402 NODES LIVE</span>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 flex-1 flex flex-col md:grid md:grid-cols-12 items-center px-8 md:px-20 py-12 gap-12">

                {/* LEFT CONTENT */}
                <div className="md:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] text-[#00FF85] border border-[#00FF85]/30 px-3 py-1.5 bg-[#00FF85]/5 rounded-sm">
                        <Star size={10} fill="#00FF85" />
                        PRISMATIC PROTOCOL 2026
                    </div>

                    <h1 className="leading-[0.9] select-none">
                        <span className="text-6xl md:text-6xl font-extralight tracking-tighter block text-white/90">POWER</span>
                        <span className="text-6xl md:text-6xl font-black tracking-tighter block text-white italic">SHARED.</span>
                        <span className="text-6xl md:text-6xl font-extralight tracking-tighter block text-white/90 mt-2">RANGE</span>
                        <span className="text-6xl md:text-6xl font-black tracking-tighter block text-[#00FF85] drop-shadow-[0_0_20px_rgba(0,255,133,0.2)]">SAVED.</span>
                    </h1>

                    <p className="max-w-md text-sm md:text-base text-white/40 font-light leading-relaxed">
                        Revolutionizing EV infrastructure through decentralized private networks.
                        Earn revenue or gain range—seamlessly integrated into the Prismatic ecosystem.
                    </p>
                </div>

                {/* RIGHT CONTENT (ACTION CARDS) */}
                <div className="md:col-span-6 flex flex-col sm:flex-row gap-6 justify-end w-full">

                    {/* DRIVER CARD */}
                    <div
                        onClick={() => navigate('/driver')}
                        className="w-full sm:w-72 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden group cursor-pointer transition-all hover:border-[#00FF85]/50 hover:-translate-y-2"
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_right,#00FF8515,transparent_70%)]" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-xl bg-[#00FF85]/10 flex items-center justify-center mb-8 border border-[#00FF85]/20">
                                <Zap size={20} className="text-[#00FF85] fill-[#00FF85]/20" />
                            </div>

                            <div className="text-[10px] tracking-[0.3em] font-black text-white/30 mb-2">ACCESS NODE</div>
                            <h3 className="text-2xl font-light mb-4">I am an <br /><span className="font-bold italic text-white">EV Driver</span></h3>

                            <p className="text-white/40 text-xs font-light leading-relaxed mb-8">
                                Locate and unlock private high-speed charging nodes across the metropolitan area.
                            </p>

                            <div className="mt-auto flex items-center gap-2 text-[#00FF85] text-[10px] font-black tracking-widest">
                                INITIALIZE MAP <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* HOST CARD */}
                    <div
                        onClick={() => navigate('/host')}
                        className="w-full sm:w-72 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 relative overflow-hidden group cursor-pointer transition-all hover:border-[#FF3B3B]/50 hover:-translate-y-2"
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_right,#FF3B3B15,transparent_70%)]" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-xl bg-[#FF3B3B]/10 flex items-center justify-center mb-8 border border-[#FF3B3B]/20">
                                <Home size={20} className="text-[#FF3B3B]" />
                            </div>

                            <div className="text-[10px] tracking-[0.3em] font-black text-white/30 mb-2">HOST NODE</div>
                            <h3 className="text-2xl font-light mb-4">I am a <br /><span className="font-bold italic text-white">Home Host</span></h3>

                            <p className="text-white/40 text-xs font-light leading-relaxed mb-8">
                                Onboard your home charger to the network and generate passive revenue units.
                            </p>

                            <div className="mt-auto flex items-center gap-2 text-[#FF3B3B] text-[10px] font-black tracking-widest">
                                REGISTER ASSET <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* --- COMBINED ABOUT US SECTION --- */}
            <section className="relative z-10 px-8 md:px-20 pt-40 pb-32 border-t border-white/5">
                <div className="space-y-8">
                    {/* TITLE */}
                    <div className="space-y-4">
                        <div className="text-[10px] font-bold tracking-[0.4em] text-[#00FF85] border border-[#00FF85]/30 px-3 py-1.5 bg-[#00FF85]/5 inline-block">
                            ABOUT CHARGEKARO
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light leading-tight">
                            Powering the Future of <br />
                            <span className="font-bold italic text-[#00FF85]">EV Charging</span>
                        </h2>
                    </div>

                    {/* UPDATED CONTENT BLOCK: Increased width to 80vw */}
                    <div className="space-y-6 max-w-[80vw]">
                        <p className="text-white/40 text-sm md:text-base leading-relaxed">
                            ChargeKaro is an innovative peer-to-peer EV charging platform designed to make electric vehicle charging accessible, affordable, and convenient for everyone. As India moves toward a sustainable future, the lack of widespread charging infrastructure remains a major challenge for EV users. ChargeKaro bridges this gap by connecting EV drivers with nearby homeowners who are willing to share their electricity, transforming private homes into smart charging stations.
                        </p>
                        <p className="text-white/40 text-sm md:text-base leading-relaxed">
                            Our system uses IoT-enabled smart adapters to ensure accurate tracking of electricity usage and transparent billing, allowing users to locate, book, and pay for charging in just a few clicks. This approach empowers homeowners to earn additional income from unused electricity and leverages existing infrastructure to eliminate the need for costly new charging stations. With AI-powered features for demand prediction and dynamic pricing, we ensure rapid scalability and a premium user experience.
                        </p>
                        <p className="text-white/40 text-sm md:text-base leading-relaxed">
                            We are committed to building a decentralized and sustainable EV ecosystem that reduces range anxiety and promotes green energy adoption. ChargeKaro is not just a platform — it is a decisive step toward a smarter, cleaner, and more connected future of mobility.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER STATUS BAR --- */}
            <footer className="relative z-20 border-t border-white/5 bg-black/40 backdrop-blur-md px-8 py-6">
                <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-between items-center gap-8">
                    <div className="flex gap-12">
                        <div>
                            <div className="text-[10px] font-bold tracking-widest text-white/30 mb-1 uppercase">Network Uptime</div>
                            <div className="text-sm font-mono text-[#00FF85]">99.998%</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-widest text-white/30 mb-1 uppercase">Daily Unit Vol.</div>
                            <div className="text-sm font-mono text-white">1.4M kWh</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-widest text-white/30 mb-1 uppercase">Protocol</div>
                            <div className="text-sm font-mono text-white">v4.0.2-Stable</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                        <ShieldCheck size={20} />
                        <Globe size={20} />
                        <div className="text-[10px] font-black tracking-[0.3em] border-l border-white/20 pl-6">
                            SECURED BY PRISMATIC ENCRYPT
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}