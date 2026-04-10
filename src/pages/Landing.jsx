import React from "react";

const BoltIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="#39FF14" />
    </svg>
);

const HouseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 10L12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10z" stroke="#FF3B3B" strokeWidth="1.5" />
    </svg>
);

export default function Landing() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col relative">

            {/* top green line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent" />

            {/* NAVBAR */}
            <div className="flex justify-between items-center px-10 py-4 text-sm tracking-wide">
                <div className="flex items-center gap-2 font-semibold">
                    <BoltIcon />
                    <span className="tracking-widest">CHARGEKARO</span>
                </div>

                <div className="hidden md:flex gap-6 text-white/70 text-xs tracking-widest">
                    <span>MONETIZE YOUR HOME CHARGER</span>
                    <span>/</span>
                    <span>ACCESS A NATION-WIDE NETWORK</span>
                    <span>/</span>
                    <span>SUSTAINABLE ENERGY</span>
                </div>

                <div className="flex items-center gap-2 text-[#39FF14] text-xs tracking-widest">
                    <BoltIcon />
                    NETWORK LIVE: 26,402
                </div>
            </div>

            {/* HERO */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center px-10 md:px-20 gap-6">

                {/* LEFT */}
                <div className="space-y-6">
                    <div className="text-[10px] tracking-[0.3em] text-[#39FF14] border border-[#39FF14]/40 inline-block px-3 py-1 bg-[#39FF14]/10">
                        MISSION 2026
                    </div>

                    <h1 className="leading-none font-extrabold">
                        <div className="text-6xl md:text-8xl text-white">POWER</div>
                        <div className="text-6xl md:text-8xl font-black text-white">SHARED.</div>
                        <div className="text-5xl md:text-7xl text-white">RANGE</div>
                        <div className="text-5xl md:text-7xl text-[#39FF14]">SAVED</div>
                    </h1>
                </div>

                {/* RIGHT */}
                <div className="flex gap-6 justify-center md:justify-end">

                    {/* DRIVER */}
                    <div className="w-72 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition duration-300 relative overflow-hidden group">

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,#39FF14,transparent_60%)]" />

                        <div className="relative z-10">
                            <BoltIcon />

                            <div className="text-xs tracking-widest text-white/60 mb-2 mt-4">SERVICE A</div>
                            <div className="text-2xl mb-4">
                                I am an <span className="italic">EV Driver</span>
                            </div>
                            <p className="text-white/60 text-sm mb-6">
                                Access private high-speed sockets anywhere.
                            </p>
                            <button className="text-[#39FF14] text-sm tracking-wide hover:underline">
                                OPEN MAP →
                            </button>
                        </div>
                    </div>

                    {/* HOST */}
                    <div className="w-72 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition duration-300 relative overflow-hidden group">

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,#FF3B3B,transparent_60%)]" />

                        {/* background house icon */}
                        <div className="absolute right-4 bottom-4 opacity-10 scale-[3]">
                            <HouseIcon />
                        </div>

                        <div className="relative z-10">
                            <HouseIcon />

                            <div className="text-xs tracking-widest text-white/60 mb-2 mt-4">SERVICE B</div>
                            <div className="text-2xl mb-4">
                                I am a <span className="italic">Home Host</span>
                            </div>
                            <p className="text-white/60 text-sm mb-6">
                                Turn unused parking into revenue.
                            </p>
                            <button className="text-[#FF3B3B] text-sm tracking-wide hover:underline">
                                REGISTER →
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}