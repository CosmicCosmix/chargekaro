import React, { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

// FAQ Data - EV User / Customer
const FAQS = [
    {
        q: "How do I verify connector compatibility?",
        a: "ChargeKaro automatically filters nodes based on your saved vehicle profile. Please ensure your physical port matches the listing (e.g., 15A Home Socket or Type 2 AC). For 2-wheelers, most nodes support standard 3-pin plugs, while 4-wheelers typically utilize our verified Type 2 locations."
    },
    {
        q: "Station is unreachable or inaccessible.",
        a: "P2P nodes are often located on private property. First, check the Host Instructions in your active booking for gate codes or specific parking bay numbers. If you still cannot access the plug, use the 'Call Host' feature. If no contact is made within 5 minutes, you may cancel for a full refund."
    },
    {
        q: "My charging session failed to start.",
        a: "Most startup issues are caused by a loose physical connection. Unplug and re-insert the connector firmly, then ensure the Host Node status is 'Active' on your screen. If the IoT handshake fails after three attempts, our system will auto-terminate the session to prevent any balance deduction."
    },
    {
        q: "Is it safe to charge in rain or outdoor conditions?",
        a: "All verified ChargeKaro nodes are required to meet basic weatherproofing standards. However, our IoT adapters include Ground Fault Protection and moisture sensors that instantly cut power if a short-circuit risk is detected. We recommend ensuring the connection point is covered during heavy monsoon conditions."
    },
    {
        q: "Can I monitor my charge status remotely?",
        a: "Yes. Once the IoT handshake is successful, you can monitor live kWh consumption, current charging speed, and estimated 'Time to Full' directly from your active session dashboard. You will receive a push notification the moment the session completes or if power is interrupted."
    }
]

// Robot Icon Component
const RobotHeadIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="3" stroke="#b8f200" strokeWidth="1.5" fill="#1a1a1a" />
        <circle cx="8" cy="12" r="1.5" fill="#b8f200" />
        <circle cx="16" cy="12" r="1.5" fill="#b8f200" />
    </svg>
)

const ChargeBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [chatInput, setChatInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am ChargeBot. How can I assist you with EV charging today?' }
    ])

    const bottomRef = useRef(null)

    // Auto-scroll to the latest message or typing indicator
    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isTyping, isOpen])

    // Common function to handle bot responses with a delay
    const triggerBotResponse = (response) => {
        setIsTyping(true)
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: response }])
            setIsTyping(false)
        }, 1500)
    }

    // Handle FAQ Selection
    const handleFAQClick = (faq) => {
        setMessages(prev => [...prev, { role: 'user', text: faq.q }])
        triggerBotResponse(faq.a)
    }

    // Handle User Text Input
    const handleSend = (e) => {
        e.preventDefault()
        if (!chatInput.trim()) return

        setMessages(prev => [...prev, { role: 'user', text: chatInput }])
        setChatInput('')
        triggerBotResponse("Analyzing your request... I'm currently focused on Customer FAQs, but I'll check our live status for you. Is there anything else?")
    }

    return (
        <div style={{ position: 'fixed', bottom: '25px', left: '25px', zIndex: 9999, fontFamily: 'sans-serif' }}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#121212', border: '1px solid rgba(184,242,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <RobotHeadIcon />
                </button>
            ) : (
                <div style={{ width: '380px', height: '560px', background: '#0c0c0c', borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '1px solid #222', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>

                    {/* Header */}
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', background: '#111' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RobotHeadIcon size={20} />
                            <span style={{ color: '#fff', fontWeight: '600' }}>ChargeBot Customer Support</span>
                        </div>
                        <X color="#aaa" onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} size={20} />
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? '#b8f200' : '#222',
                                padding: '12px',
                                borderRadius: '14px',
                                maxWidth: '85%',
                                fontSize: '14px',
                                color: m.role === 'user' ? '#000' : '#fff',
                                lineHeight: '1.4'
                            }}>
                                {m.text}
                            </div>
                        ))}

                        {/* Typing Animation Block */}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', background: '#222', padding: '12px', borderRadius: '14px', color: '#fff', fontSize: '14px', width: 'fit-content' }}>
                                <span className="typing-dots">...</span>
                                <style>{`
                                    @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
                                    .typing-dots { animation: blink 1.4s infinite both; font-weight: bold; letter-spacing: 2px; }
                                `}</style>
                            </div>
                        )}

                        {/* Initial FAQs - Hidden when user starts interacting */}
                        {messages.length === 1 && !isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', width: '100%' }}>
                                <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>Frequently Asked Questions:</p>
                                {FAQS.map((faq, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleFAQClick(faq)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid rgba(184,242,0,0.4)',
                                            color: '#b8f200',
                                            padding: '12px 14px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            width: '100%',
                                            display: 'block',
                                            transition: 'all 0.2s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = 'rgba(184,242,0,0.1)'
                                            e.target.style.borderColor = '#b8f200'
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = 'transparent'
                                            e.target.style.borderColor = 'rgba(184,242,0,0.4)'
                                        }}
                                    >
                                        {faq.q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid #222', background: '#0c0c0c' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type your concern..."
                                disabled={isTyping}
                                style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: '12px', background: '#1a1a1a', color: '#fff', border: '1px solid #333', fontSize: '14px', boxSizing: 'border-box', outline: 'none', opacity: isTyping ? 0.6 : 1 }}
                            />
                            <button type="submit" disabled={isTyping} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: isTyping ? 'default' : 'pointer' }}>
                                <Send color="#b8f200" size={18} style={{ opacity: isTyping ? 0.4 : 1 }} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ChargeBot;