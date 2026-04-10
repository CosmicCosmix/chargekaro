import { useState } from 'react'
import { X, Zap, Star, CheckCircle, Clock } from 'lucide-react'

export default function BookingModal({ host, onClose }) {
    const [step, setStep] = useState(1) // 1=details, 2=confirm, 3=success
    const [units, setUnits] = useState(10)

    const total = (units * host.rate + host.parking).toFixed(2)

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-graphite border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div>
                        <h2 className="font-display font-bold text-base">
                            {step === 1 ? 'Book a Session' : step === 2 ? 'Confirm Booking' : 'Booking Confirmed!'}
                        </h2>
                        <p className="text-xs text-white/40 font-body mt-0.5">{host.name} · {host.address}</p>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1 bg-steel rounded-xl p-3">
                                    <div className="text-[10px] text-white/30 mb-1">Connector</div>
                                    <div className="font-display font-semibold text-sm">{host.connector}</div>
                                </div>
                                <div className="flex-1 bg-steel rounded-xl p-3">
                                    <div className="text-[10px] text-white/30 mb-1">Type</div>
                                    <div className={`font-display font-semibold text-sm ${host.type === 'Fast' ? 'text-ember' : 'text-volt'}`}>{host.type}</div>
                                </div>
                                <div className="flex-1 bg-steel rounded-xl p-3">
                                    <div className="text-[10px] text-white/30 mb-1">Rating</div>
                                    <div className="flex items-center gap-1">
                                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-display font-semibold text-sm">{host.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs text-white/40">Units to charge (kWh)</label>
                                    <span className="text-volt font-display font-bold text-sm">{units} kWh</span>
                                </div>
                                <input
                                    type="range" min="1" max="50" value={units}
                                    onChange={e => setUnits(parseInt(e.target.value))}
                                    className="w-full accent-[#C8F400] h-1.5 rounded-full"
                                />
                                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                                    <span>1 kWh</span><span>50 kWh</span>
                                </div>
                            </div>

                            <div className="bg-steel rounded-xl p-3 space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40">Charging ({units} kWh × ₹{host.rate})</span>
                                    <span>₹{(units * host.rate).toFixed(2)}</span>
                                </div>
                                {host.parking > 0 && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Parking fee</span>
                                        <span>₹{host.parking}</span>
                                    </div>
                                )}
                                <div className="border-t border-white/10 pt-1.5 flex justify-between text-sm">
                                    <span className="font-display font-semibold">Total</span>
                                    <span className="font-display font-bold text-volt">₹{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-volt text-carbon font-display font-bold py-3.5 rounded-xl hover:bg-volt/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                Proceed to Confirm
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="bg-volt/10 border border-volt/20 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Host</span>
                                    <span className="font-display font-semibold">{host.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Units</span>
                                    <span className="font-display font-semibold">{units} kWh</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Total</span>
                                    <span className="font-display font-bold text-volt text-base">₹{total}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 bg-steel text-white/50 font-display font-semibold py-3 rounded-xl hover:bg-mist transition-colors">Back</button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-volt text-carbon font-display font-bold py-3 rounded-xl hover:bg-volt/90 transition-all">Pay & Book</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center py-4 space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-volt/20 border-2 border-volt flex items-center justify-center">
                                <CheckCircle size={32} className="text-volt" />
                            </div>
                            <div className="text-center">
                                <div className="font-display font-bold text-lg mb-1">You're confirmed!</div>
                                <p className="text-xs text-white/40 font-body">Head to {host.address}. The host has been notified.</p>
                            </div>
                            <div className="w-full bg-steel rounded-xl p-3 flex items-center gap-3">
                                <Clock size={14} className="text-volt" />
                                <span className="text-xs text-white/60 font-body">ETA: ~{host.distance} · Navigate with Google Maps</span>
                            </div>
                            <button onClick={onClose} className="w-full bg-volt text-carbon font-display font-bold py-3 rounded-xl hover:bg-volt/90 transition-all">Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}