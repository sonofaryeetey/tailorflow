"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { User, MapPin, Phone, ChevronLeft, Search } from 'lucide-react'
import HamburgerMenu from '@/components/HamburgerMenu'

export default function ClientsPage() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('full_name')

            if (error) throw error
            setClients(data || [])
        } catch (error) {
            console.error('Error fetching clients:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredClients = clients.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)
    )

    if (loading) {
        return (
            <div className="container py-12 text-center">
                <HamburgerMenu />
                <p className="text-zinc-400">Loading clients...</p>
            </div>
        )
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <HamburgerMenu />
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="btn-outline flex items-center justify-center" style={{ width: '40px', height: '40px', padding: 0 }}>
                    <ChevronLeft size={24} />
                </Link>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Clients</h1>
            </div>

            <div className="input-group mb-8">
                <Search size={20} className="input-icon" />
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-with-icon"
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-400">Loading clients...</p>
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">No clients found.</p>
                    <Link href="/add-client" className="btn-primary">
                        Add Your First Client
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filteredClients.map((client) => (
                        <Link key={client.id} href={`/clients/${client.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--surface)',
                                border: '1px solid rgba(63, 63, 70, 0.5)',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                className="hover:border-primary">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'rgba(203, 161, 110, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <User size={16} color="var(--primary)" />
                                    </div>
                                    <span style={{
                                        color: 'white',
                                        fontSize: '0.9375rem',
                                        fontWeight: 500,
                                        letterSpacing: '-0.01em'
                                    }}>
                                        {client.full_name}
                                    </span>
                                </div>

                                <span style={{
                                    color: '#71717a',
                                    fontSize: '0.8125rem',
                                    fontWeight: 500
                                }}>
                                    {new Date(client.created_at).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div >
    )
}
