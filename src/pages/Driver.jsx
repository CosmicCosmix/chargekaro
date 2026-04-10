import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, MapPin, Navigation, Info } from 'lucide-react'
import { fetchHosts } from '../api/hostApi'
import BookingModal from '../components/BookingModal'
import ChatBot from '../components/DriverChatBot'

// Hardcoded User Location (Example: Mount Road / Guindy area in Chennai)
const USER_LOCATION = { lat: 13.0604, lng: 80.2496 }

const hostCoords = [
    { id: 1, lat: 13.0827, lng: 80.2707 },
    { id: 2, lat: 13.0418, lng: 80.2341 },
    { id: 3, lat: 12.9815, lng: 80.2180 },
    { id: 4, lat: 13.0012, lng: 80.2565 },
    { id: 5, lat: 12.9010, lng: 80.2279 },
    { id: 6, lat: 13.0358, lng: 80.1561 },
]

export default function Driver() {
    const navigate = useNavigate()
    const [hostsWithCoords, setHostsWithCoords] = useState([])
    const [selected, setSelected] = useState(null)
    const [booking, setBooking] = useState(null)
    const [filter, setFilter] = useState('All')
    const [mapReady, setMapReady] = useState(false)

    const mapRef = useRef(null)
    const leafletMap = useRef(null)
    const markersRef = useRef({})
    const routingControlRef = useRef(null)

    const types = ['All', 'Fast', 'Standard']

    // 🔹 Fetch Hosts
    useEffect(() => {
        async function load() {
            try {
                const data = await fetchHosts()
                const merged = data.map(h => ({
                    ...h,
                    ...(hostCoords.find(c => c.id === h.id) || {})
                }))
                setHostsWithCoords(merged)
            } catch (err) {
                console.error('API ERROR:', err)
            }
        }
        load()
    }, [])

    // 🔹 Initialize Map & Scripts
    useEffect(() => {
        if (leafletMap.current) return

        const initMap = async () => {
            // Load CSS if not already present
            if (!document.getElementById('leaflet-css')) {
                const linkL = document.createElement('link')
                linkL.id = 'leaflet-css'
                linkL.rel = 'stylesheet'
                linkL.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
                document.head.appendChild(linkL)

                const linkR = document.createElement('link')
                linkR.id = 'lrm-css'
                linkR.rel = 'stylesheet'
                linkR.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css'
                document.head.appendChild(linkR)
            }

            // Safe script loader for React Strict Mode
            const loadScript = (src, id) => new Promise((resolve) => {
                if (document.getElementById(id)) return resolve()
                const script = document.createElement('script')
                script.id = id
                script.src = src
                script.onload = resolve
                document.head.appendChild(script)
            })

            await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'leaflet-js')
            await loadScript('https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js', 'lrm-js')

            const L = window.L
            const map = L.map(mapRef.current, {
                center: [USER_LOCATION.lat, USER_LOCATION.lng],
                zoom: 12,
                zoomControl: false,
            })

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                {
                    attribution: '&copy; CARTO',
                    maxZoom: 19,
                }
            ).addTo(map)

            L.control.zoom({ position: 'bottomleft' }).addTo(map)

            // Add User Location Marker (Blue Dot)
            const userIcon = L.divIcon({
                className: '',
                html: `<div style="width:18px; height:18px; background:#3b82f6; border:3px solid white; border-radius:50%; box-shadow:0 0 15px rgba(59,130,246,0.8);"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9],
            })
            L.marker([USER_LOCATION.lat, USER_LOCATION.lng], { icon: userIcon })
                .addTo(map)
                .bindTooltip('Your Location', { direction: 'top', className: 'bg-black text-white border-white/10' })

            leafletMap.current = map
            setMapReady(true)
        }

        initMap()

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove()
                leafletMap.current = null
            }
        }
    }, [])

    // 🔹 Render Host Markers
    useEffect(() => {
        if (!mapReady || !leafletMap.current || hostsWithCoords.length === 0) return

        const L = window.L
        Object.values(markersRef.current).forEach(marker => {
            leafletMap.current.removeLayer(marker)
        })
        markersRef.current = {}

        hostsWithCoords.forEach(h => {
            if (!h.lat || !h.lng) return

            const color = !h.available ? '#4B5563' : h.type === 'Fast' ? '#10B981' : '#A3E635'

            const icon = L.divIcon({
                className: '',
                html: `
                    <div style="
                        width:36px; height:36px; border-radius:10px;
                        background:#111; border:2px solid ${color};
                        display:flex; align-items:center; justify-content:center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    ">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="${color}">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
            })

            const marker = L.marker([h.lat, h.lng], { icon }).addTo(leafletMap.current)
            marker.on('click', () => setSelected(prev => (prev === h.id ? null : h.id)))
            markersRef.current[h.id] = marker
        })
    }, [hostsWithCoords, mapReady])

    // 🔹 Handle Routing when a station is selected
    useEffect(() => {
        if (!mapReady || !leafletMap.current || !window.L || !window.L.Routing) return

        const L = window.L

        // Clear existing route if any
        if (routingControlRef.current) {
            leafletMap.current.removeControl(routingControlRef.current)
            routingControlRef.current = null
        }

        if (selected) {
            const host = hostsWithCoords.find(h => h.id === selected)
            if (host && host.lat && host.lng) {
                routingControlRef.current = L.Routing.control({
                    waypoints: [
                        L.latLng(USER_LOCATION.lat, USER_LOCATION.lng),
                        L.latLng(host.lat, host.lng)
                    ],
                    lineOptions: {
                        styles: [{ color: '#A3E635', opacity: 0.8, weight: 4 }] // Lime green route
                    },
                    createMarker: () => null, // Don't create default green/red LRM markers
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    showAlternatives: false,
                    show: false // Hides the ugly default text-instructions panel
                }).addTo(leafletMap.current)
            }
        }
    }, [selected, hostsWithCoords, mapReady])

    const filtered = filter === 'All' ? hostsWithCoords : hostsWithCoords.filter(h => h.type === filter)

    return (
        <div className="h-screen relative bg-neutral-950 font-sans text-slate-200 overflow-hidden">
            <div ref={mapRef} className="absolute inset-0 z-0" />

            {/* Top Bar / Logo */}
            <div
                className="absolute top-6 left-6 z-20 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 cursor-pointer hover:bg-black/60 transition"
                onClick={() => navigate('/')}
            >
                <div className="w-8 h-8 bg-lime-400 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.4)]">
                    <Zap size={16} className="text-black" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                    Charge<span className="text-lime-400">Karo</span>
                </span>
            </div>

            {/* Right Sleek Panel */}
            <div className="absolute top-6 right-6 w-80 max-h-[calc(100vh-48px)] bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-3xl z-[1000] flex flex-col shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white tracking-tight">Charging Hubs</h2>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Chennai</span>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/5">
                        {types.map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${filter === t
                                        ? 'bg-lime-400 text-black shadow-lg'
                                        : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Station List */}
                    <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '60vh' }}>
                        {filtered.map(h => (
                            <div
                                key={h.id}
                                onClick={() => setSelected(prev => (prev === h.id ? null : h.id))}
                                className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${selected === h.id
                                        ? 'bg-lime-400/10 border-lime-400/50'
                                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07]'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-medium text-slate-100 group-hover:text-white transition-colors">{h.name}</h3>
                                    <span className="text-lime-400 font-bold text-sm">₹{h.rate}</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                                    <MapPin size={12} />
                                    <span className="truncate">{h.address}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${h.available ? 'bg-lime-500 animate-pulse' : 'bg-neutral-600'}`} />
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                                            {h.available ? 'Available' : 'In Use'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                                        {h.type}
                                    </span>
                                </div>

                                {h.available && selected === h.id && (
                                    <button
                                        className="mt-4 w-full bg-lime-400 hover:bg-lime-300 text-black font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                                        onClick={e => {
                                            e.stopPropagation()
                                            setBooking(h)
                                        }}
                                    >
                                        <Navigation size={14} />
                                        Confirm Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-auto p-4 border-t border-white/5 bg-black/20 rounded-b-3xl flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Info size={14} className="text-blue-400" />
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-tight">
                        Paths are calculated based on real-time routing logic.
                    </p>
                </div>
            </div>

            {booking && (
                <BookingModal host={booking} onClose={() => setBooking(null)} />
            )}

            <ChatBot />

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                
                /* Minor override to keep Leaflet tooltips looking dark/sleek */
                .leaflet-tooltip.bg-black {
                    background-color: rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                }
                .leaflet-tooltip-top.bg-black:before {
                    border-top-color: rgba(0,0,0,0.8);
                }
            `}} />
        </div>
    )
}