import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Star, CheckCircle } from 'lucide-react'
import { hosts } from '../data/hosts'
import BookingModal from '../components/BookingModal'

const hostCoords = [
    { id: 1, lat: 13.0827, lng: 80.2707 },
    { id: 2, lat: 13.0418, lng: 80.2341 },
    { id: 3, lat: 12.9815, lng: 80.2180 },
    { id: 4, lat: 13.0012, lng: 80.2565 },
    { id: 5, lat: 12.9010, lng: 80.2279 },
    { id: 6, lat: 13.0358, lng: 80.1561 },
]

const hostsWithCoords = hosts.map(h => ({
    ...h,
    ...hostCoords.find(c => c.id === h.id),
}))

export default function Driver() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)
    const [booking, setBooking] = useState(null)
    const [filter, setFilter] = useState('All')
    const mapRef = useRef(null)
    const leafletMap = useRef(null)
    const markersRef = useRef({})
    const listRefs = useRef({})

    const types = ['All', 'Fast', 'Standard']
    const filtered = filter === 'All' ? hostsWithCoords : hostsWithCoords.filter(h => h.type === filter)

    useEffect(() => {
        if (leafletMap.current) return

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
            const L = window.L
            const map = L.map(mapRef.current, {
                center: [13.0200, 80.2100],
                zoom: 12,
                zoomControl: false,
            })

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                maxZoom: 19,
            }).addTo(map)

            L.control.zoom({ position: 'bottomleft' }).addTo(map)

            hostsWithCoords.forEach(h => {
                const color = !h.available ? '#3a3a3a' : h.type === 'Fast' ? '#e8572a' : '#b8f200'
                const icon = L.divIcon({
                    className: '',
                    html: `
            <div style="
              width:32px;height:32px;border-radius:50%;
              background:${color};
              border:1.5px solid rgba(255,255,255,0.15);
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 4px 16px ${h.available ? color + '55' : 'transparent'};
              cursor:pointer;
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="${!h.available ? '#666' : '#0a0a0a'}" xmlns="http://www.w3.org/2000/svg">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div style="
              text-align:center;font-size:9px;font-weight:600;letter-spacing:0.03em;
              color:rgba(255,255,255,0.6);margin-top:3px;
              font-family:'DM Sans',sans-serif;
            ">₹${h.rate}</div>
          `,
                    iconSize: [32, 48],
                    iconAnchor: [16, 48],
                })

                const marker = L.marker([h.lat, h.lng], { icon }).addTo(map)
                marker.on('click', () => setSelected(prev => prev === h.id ? null : h.id))
                markersRef.current[h.id] = marker
            })

            leafletMap.current = map
        }
        document.head.appendChild(script)

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove()
                leafletMap.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (!leafletMap.current || !selected) return
        const host = hostsWithCoords.find(h => h.id === selected)
        if (!host) return
        leafletMap.current.panTo([host.lat, host.lng], { animate: true, duration: 0.6 })
        const el = listRefs.current[selected]
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [selected])

    return (
        <div className="h-screen relative overflow-hidden bg-[#080808]">

            {/* Map fills entire screen */}
            <div ref={mapRef} className="absolute inset-0 z-0" />

            {/* Logo — top left, floating */}
            <div className="absolute top-5 left-5 z-20 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#b8f200' }}>
                    <Zap size={13} style={{ color: '#080808', fill: '#080808' }} />
                </div>
                <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    letterSpacing: '-0.02em',
                    color: '#fff',
                }}>
                    Charge<span style={{ color: '#b8f200' }}>Karo</span>
                </span>
            </div>

            {/* Floating Panel — right */}
            <div
                className="absolute top-5 right-5 bottom-5 z-10 flex flex-col"
                style={{
                    width: '264px',
                    background: 'rgba(10, 10, 10, 0.88)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                }}
            >
                {/* Panel Header */}
                <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#fff',
                            letterSpacing: '-0.01em',
                        }}>
                            Available Stations
                        </span>
                        <span style={{
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.35)',
                            fontFamily: "'DM Sans', sans-serif",
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#b8f200', display: 'inline-block' }} />
                            {hostsWithCoords.filter(h => h.available).length} live
                        </span>
                    </div>

                    {/* Filter pills */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {types.map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                style={{
                                    flex: 1,
                                    padding: '6px 0',
                                    borderRadius: '10px',
                                    fontSize: '10px',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 500,
                                    letterSpacing: '0.02em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    background: filter === t ? '#b8f200' : 'rgba(255,255,255,0.05)',
                                    color: filter === t ? '#0a0a0a' : 'rgba(255,255,255,0.35)',
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Host List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
                    {filtered.map(h => (
                        <button
                            key={h.id}
                            ref={el => listRefs.current[h.id] = el}
                            onClick={() => setSelected(h.id === selected ? null : h.id)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                display: 'block',
                                padding: '12px',
                                marginBottom: '6px',
                                borderRadius: '14px',
                                border: h.id === selected
                                    ? '1px solid rgba(184,242,0,0.25)'
                                    : '1px solid rgba(255,255,255,0.04)',
                                background: h.id === selected
                                    ? 'rgba(184,242,0,0.06)'
                                    : 'rgba(255,255,255,0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '10px',
                                    overflow: 'hidden', background: 'rgba(255,255,255,0.06)',
                                    flexShrink: 0,
                                }}>
                                    <img src={h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Name + type badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                        <span style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            color: '#fff',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '110px',
                                        }}>{h.name}</span>
                                        <span style={{
                                            fontSize: '9px',
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 500,
                                            letterSpacing: '0.04em',
                                            padding: '2px 7px',
                                            borderRadius: '20px',
                                            background: h.type === 'Fast' ? 'rgba(232,87,42,0.15)' : 'rgba(184,242,0,0.1)',
                                            color: h.type === 'Fast' ? '#e8572a' : '#b8f200',
                                        }}>{h.type}</span>
                                    </div>

                                    {/* Address */}
                                    <p style={{
                                        fontSize: '10px',
                                        color: 'rgba(255,255,255,0.3)',
                                        fontFamily: "'DM Sans', sans-serif",
                                        margin: '0 0 8px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>{h.address}</p>

                                    {/* Rate + meta */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{
                                            fontFamily: "'Syne', sans-serif",
                                            fontWeight: 700,
                                            fontSize: '14px',
                                            color: '#b8f200',
                                            letterSpacing: '-0.02em',
                                        }}>
                                            ₹{h.rate}
                                            <span style={{ fontWeight: 400, fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: 0 }}>/unit</span>
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Star size={9} style={{ color: '#facc15', fill: '#facc15' }} />
                                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>{h.rating}</span>
                                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)' }}>·</span>
                                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>{h.distance}</span>
                                        </div>
                                    </div>

                                    {/* Unavailable */}
                                    {!h.available && (
                                        <p style={{ fontSize: '9px', color: '#e8572a', marginTop: '6px', fontFamily: "'DM Sans', sans-serif" }}>
                                            Currently busy
                                        </p>
                                    )}

                                    {/* Book CTA */}
                                    {h.available && h.id === selected && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setBooking(h) }}
                                            style={{
                                                marginTop: '10px',
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '10px',
                                                background: '#b8f200',
                                                color: '#0a0a0a',
                                                fontFamily: "'Syne', sans-serif",
                                                fontWeight: 700,
                                                fontSize: '11px',
                                                letterSpacing: '0.01em',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Reserve Session
                                        </button>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        {[
                            { color: '#e8572a', label: 'Fast' },
                            { color: '#b8f200', label: 'Standard' },
                            { color: '#3a3a3a', label: 'Busy' },
                        ].map(({ color, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {booking && <BookingModal host={booking} onClose={() => setBooking(null)} />}
        </div>
    )
}