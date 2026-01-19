"use client"

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, User, Phone, MapPin, Ruler, Pencil, Trash2 } from 'lucide-react'
import HamburgerMenu from '@/components/HamburgerMenu'

export default function ClientDetailsPage({ params }) {
    // Unwrap params using React.use()
    const { id } = use(params)
    const router = useRouter()

    const [client, setClient] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            fetchClientDetails()
        }
    }, [id])

    const fetchClientDetails = async () => {
        try {
            // Fetch Client Info
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()

            if (clientError) throw clientError
            setClient(clientData)

            // Fetch Items
            const { data: itemsData, error: itemsError } = await supabase
                .from('items')
                .select('*')
                .eq('client_id', id)
                .order('created_at', { ascending: false })

            if (itemsError) throw itemsError
            console.log('Fetched Items:', itemsData) // Debugging: Check console for image_url
            setItems(itemsData || [])

        } catch (error) {
            console.error('Error loading client details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClient = async () => {
        const confirmMessage = `Are you sure you want to delete ${client.full_name}? \n\nThis will PERMANENTLY delete the client and ALL their order history/images.\n\nThis action cannot be undone.`
        if (!confirm(confirmMessage)) {
            return
        }

        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id)

            if (error) throw error

            alert('Client deleted successfully.')
            router.push('/clients')

        } catch (error) {
            console.error('Error deleting client:', error)
            alert('Failed to delete client: ' + error.message)
        }
    }

    const handleDelete = async (itemId) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', itemId)

            if (error) throw error

            // Remove from state immediately for fast UI
            setItems(prevItems => prevItems.filter(item => item.id !== itemId))
            alert('Order deleted.')

        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Failed to delete: ' + error.message)
        }
    }

    if (loading) {
        return (
            <div className="container py-12 text-center">
                <HamburgerMenu />
                <p className="text-zinc-400">Loading details...</p>
            </div>
        )
    }

    if (!client) {
        return (
            <div className="container py-12 text-center">
                <HamburgerMenu />
                <p className="text-red-400">Client not found.</p>
                <Link href="/clients" className="btn-outline mt-4 inline-block">
                    Back to Clients
                </Link>
            </div>
        )
    }

    return (
        <div className="container" style={{ padding: '3.5rem 1rem 2rem' }}>
            <HamburgerMenu />

            {/* Header / Back */}
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href="/clients" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors" style={{ fontSize: '0.875rem' }}>
                    <ArrowLeft size={18} />
                    Back to Clients
                </Link>
            </div>

            {/* Client Info Card */}
            <div style={{
                background: 'var(--surface)',
                border: '1px solid rgba(63, 63, 70, 0.5)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '1.5rem'
            }}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'rgba(203, 161, 110, 0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)',
                        flexShrink: 0
                    }}>
                        <User size={28} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>{client.full_name}</h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#a1a1aa' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <Phone size={14} /> {client.phone}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <MapPin size={14} /> {client.location}
                            </span>
                            <span style={{ color: '#71717a', fontSize: '0.8125rem' }}>
                                Since {new Date(client.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '0.75rem' }}>
                <button
                    onClick={handleDeleteClient}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#f87171',
                        background: 'transparent',
                        border: '1px solid rgba(153, 27, 27, 0.5)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        transition: 'all 0.2s'
                    }}
                    className="hover:bg-red-900/20"
                >
                    <Trash2 size={16} />
                    Delete Client
                </button>

                <Link href={`/clients/${id}/add-order`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Ruler size={16} />
                    Add New Order
                </Link>
            </div>

            {/* Items Grid */}
            <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Order History ({items.length})</h2>

            {
                items.length === 0 ? (
                    <p style={{ color: '#71717a', fontStyle: 'italic', fontSize: '0.875rem' }}>No clothing items recorded for this client.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item, idx) => (
                            <div key={item.id} style={{ position: 'relative' }}>
                                <Link
                                    href={`/clients/${id}/order/${item.id}`}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        background: 'var(--surface)',
                                        border: '1px solid rgba(63, 63, 70, 0.5)',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s'
                                    }}
                                    className="hover:border-primary"
                                >
                                    {/* Image Preview */}
                                    <div style={{
                                        width: '100px',
                                        height: '120px',
                                        backgroundImage: item.image_url ? `url('${item.image_url}')` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: 'rgba(39, 39, 42, 0.8)',
                                        borderRadius: '6px',
                                        flexShrink: 0
                                    }}></div>

                                    {/* Order Info */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ color: '#ededed', fontSize: '0.9375rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                                                Order #{idx + 1}
                                            </div>
                                            <div style={{ color: '#71717a', fontSize: '0.8125rem' }}>
                                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>
                                            Click to view details →
                                        </div>
                                    </div>
                                </Link>

                                {/* Action Icons - Positioned Absolutely */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    zIndex: 10
                                }}>
                                    <Link
                                        href={`/clients/${id}/edit-item/${item.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            color: '#a1a1aa',
                                            transition: 'color 0.2s',
                                            background: 'rgba(0, 0, 0, 0.6)',
                                            padding: '0.25rem',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        className="hover:text-white"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleDelete(item.id)
                                        }}
                                        style={{
                                            color: '#a1a1aa',
                                            background: 'rgba(0, 0, 0, 0.6)',
                                            border: 'none',
                                            padding: '0.25rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        className="hover:text-red-500"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

        </div>
    )
}
