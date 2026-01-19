"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Users, UserPlus } from 'lucide-react'

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false)

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const menuItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/clients', label: 'View Clients', icon: Users },
        { href: '/add-client', label: 'Add Client', icon: UserPlus },
    ]

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    zIndex: 1000,
                    background: 'rgba(203, 161, 110, 0.1)',
                    border: '1px solid rgba(203, 161, 110, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                className="hover-menu-button"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X size={24} color="#cba16e" style={{ transition: 'transform 0.3s ease' }} />
                ) : (
                    <Menu size={24} color="#cba16e" style={{ transition: 'transform 0.3s ease' }} />
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 998,
                        animation: 'fadeIn 0.3s ease'
                    }}
                />
            )}

            {/* Menu Panel */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: isOpen ? 0 : '-100%',
                    height: '100vh',
                    width: '280px',
                    maxWidth: '85vw',
                    background: 'rgba(15, 15, 18, 0.98)',
                    backdropFilter: 'blur(10px)',
                    borderLeft: '1px solid rgba(63, 63, 70, 0.5)',
                    zIndex: 999,
                    transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '5rem 2rem 2rem'
                }}
            >
                {/* Menu Items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '8px',
                                    color: '#ededed',
                                    textDecoration: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    border: '1px solid transparent',
                                    animation: `slideIn 0.3s ease ${index * 0.1}s backwards`
                                }}
                                className="menu-item"
                            >
                                <Icon size={20} color="#cba16e" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div style={{
                    marginTop: 'auto',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(63, 63, 70, 0.5)',
                    fontSize: '0.75rem',
                    color: '#71717a',
                    textAlign: 'center'
                }}>
                    TailorFlow © 2026
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
                .hover-menu-button:hover {
                    background: rgba(203, 161, 110, 0.2);
                    border-color: rgba(203, 161, 110, 0.5);
                    transform: scale(1.05);
                }

                .menu-item:hover {
                    background: rgba(203, 161, 110, 0.1);
                    border-color: rgba(203, 161, 110, 0.3);
                    transform: translateX(-4px);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    )
}
