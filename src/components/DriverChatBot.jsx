import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

// ================= CHATBOT START =================

// Robot Icon
const RobotHeadIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="3" stroke="#b8f200" strokeWidth="1.5" fill="#1a1a1a" />
        <circle cx="8" cy="12" r="1.5" fill="#b8f200" />
        <circle cx="16" cy="12" r="1.5" fill="#b8f200" />
    </svg>
)

// Chatbot Component
const ChargeBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [chatInput, setChatInput] = useState('')
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am ChargeBot. How can I assist you with EV charging?' }
    ])

    // ✅ auto scroll
    const bottomRef = useRef(null)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (!chatInput.trim()) return

        // ✅ safe state update
        setMessages(prev => [...prev, { role: 'user', text: chatInput }])
        setChatInput('')

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { role: 'bot', text: "Analyzing... Found a nearby fast charger ⚡" }
            ])
        }, 800)
    }

    return (
        <div style={{ position: 'fixed', bottom: '25px', left: '25px', zIndex: 9999 }}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '20px',
                        background: '#121212',
                        border: '1px solid rgba(184,242,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <RobotHeadIcon />
                </button>
            ) : (
                <div style={{
                    width: '380px',
                    height: '560px',
                    background: '#0c0c0c',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <span style={{ color: '#fff' }}>ChargeBot</span>
                        <X color="#aaa" onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '16px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                marginBottom: '10px',
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? '#b8f200' : '#222',
                                padding: '10px',
                                borderRadius: '12px',
                                color: m.role === 'user' ? '#000' : '#fff'
                            }}>
                                {m.text}
                            </div>
                        ))}

                        {/* auto scroll anchor */}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type your concern..."
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    background: '#1a1a1a',
                                    color: '#fff',
                                    border: 'none'
                                }}
                            />
                            <button type="submit" style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none'
                            }}>
                                <Send color="#b8f200" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

// ================= CHATBOT END =================


export default ChargeBot 
