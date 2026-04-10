import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Zap, Battery, DollarSign, Clock, XCircle, CheckCircle } from 'lucide-react'

export default function ActiveSession() {
  const navigate = useNavigate()
  
  // 1. Initial Mock Orders (Simulating fetch from Driver page)
  const [orders, setOrders] = useState([
    { id: 1, driver: "Rahul S.", car: "Tata Nexon EV", plate: "TN 09 AB 1234", requested: 5, rate: 7.5 },
    { id: 2, driver: "Priya K.", car: "MG ZS EV", plate: "TN 07 CD 5678", requested: 3, rate: 8.0 },
    { id: 3, driver: "Vikram R.", car: "Hyundai IONIQ 5", plate: "TN 01 EF 9012", requested: 10, rate: 9.5 }
  ])

  // 2. Active Session State
  const [activeOrder, setActiveOrder] = useState(null)
  const [units, setUnits] = useState(0)
  const [time, setTime] = useState(0)

  // 3. Reject Logic: Removes the order from the list
  const handleReject = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id))
  }

  // 4. Live Simulation Timer
  useEffect(() => {
    if (!activeOrder) return
    
    const t = setInterval(() => {
      setUnits(prev => {
        const next = prev + 0.1 // Simulated charging speed
        // AUTO-STOP: Stops exactly at the requested limit
        if (next >= activeOrder.requested) {
          clearInterval(t)
          handleCompletion()
          return activeOrder.requested
        }
        return next
      })
      setTime(p => p + 1)
    }, 1000)

    return () => clearInterval(t)
  }, [activeOrder])

  const handleCompletion = () => {
    alert(`Charging Target Reached! Total Collected: ₹${(activeOrder.requested * activeOrder.rate).toFixed(2)}`)
    setActiveOrder(null)
    setUnits(0)
    setTime(0)
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <div className="px-5 py-4 bg-graphite border-b border-white/5 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/host')} className="text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={20}/>
        </button>
        <h1 className="font-display font-bold text-base">Incoming Charging Requests</h1>
      </div>

      <div className="max-w-xl mx-auto p-5">
        {!activeOrder ? (
          /* PART A: THE ORDER LIST */
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map(order => (
                <div key={order.id} className="bg-graphite border border-white/5 rounded-2xl p-5 flex flex-col gap-5 animate-slide-up">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-display font-bold text-lg text-white">{order.driver}</p>
                      <p className="text-xs text-white/40 font-body">{order.car} • {order.plate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-volt font-display font-black text-lg">₹{(order.requested * order.rate).toFixed(0)}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-tighter">{order.requested} kWh Request</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleReject(order.id)}
                      className="flex-1 bg-steel/50 text-white/60 font-display font-bold py-3 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button 
                      onClick={() => {
                        setActiveOrder(order)
                        handleReject(order.id) // Remove from list as it moves to active
                      }}
                      className="flex-1 bg-volt text-carbon font-display font-bold py-3 rounded-xl hover:bg-volt/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(200,244,0,0.2)]"
                    >
                      <CheckCircle size={16} /> Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <Zap size={48} className="mb-4 opacity-10" />
                <p className="font-body text-sm">No pending requests at the moment.</p>
              </div>
            )}
          </div>
        ) : (
          /* PART B: THE LIVE GAUGE */
          <div className="flex flex-col items-center py-10 gap-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-volt font-display font-bold uppercase tracking-widest text-xs mb-2">Charging in Progress</h2>
              <p className="text-white/60 text-sm font-body">{activeOrder.driver}'s {activeOrder.car}</p>
            </div>

            <div className="relative w-64 h-64 rounded-full border-[10px] border-steel border-t-volt flex flex-col items-center justify-center shadow-[0_0_40px_rgba(200,244,0,0.1)]">
              <Zap size={40} className="text-volt fill-volt mb-1 animate-pulse" />
              <p className="text-5xl font-display font-black text-white">{units.toFixed(2)}</p>
              <p className="text-white/30 text-xs font-body">of {activeOrder.requested} kWh</p>
            </div>

            <div className="grid grid-cols-2 w-full gap-4">
              <div className="bg-graphite rounded-2xl p-5 border border-white/5 text-center">
                <p className="text-volt font-display font-bold text-2xl">₹{(units * activeOrder.rate).toFixed(2)}</p>
                <p className="text-[10px] text-white/30 font-body uppercase mt-1">Current Bill</p>
              </div>
              <div className="bg-graphite rounded-2xl p-5 border border-white/5 text-center">
                <p className="text-white font-display font-bold text-2xl">{fmt(time)}</p>
                <p className="text-[10px] text-white/30 font-body uppercase mt-1">Elapsed Time</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveOrder(null)}
              className="w-full py-4 rounded-xl border border-white/10 text-white/30 font-display font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
            >
              STOP EMERGENCY
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
