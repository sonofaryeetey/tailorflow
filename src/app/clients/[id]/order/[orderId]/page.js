"use client"

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../../lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import HamburgerMenu from '@/components/HamburgerMenu'

export default function OrderDetailPage({ params }) {
    const { id: clientId, orderId } = use(params)
    const router = useRouter()

    const [order, setOrder] = useState(null)
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (clientId && orderId) {
            fetchOrderDetails()
        }
    }, [clientId, orderId])

    const fetchOrderDetails = async () => {
        try {
            // Fetch Order/Item
            const { data: orderData, error: orderError } = await supabase
                .from('items')
                .select('*')
                .eq('id', orderId)
                .single()

            if (orderError) throw orderError
            setOrder(orderData)

            // Fetch Client Info
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('full_name')
                .eq('id', clientId)
                .single()

            if (clientError) throw clientError
            setClient(clientData)

        } catch (error) {
            console.error('Error loading order details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return
        }

        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', orderId)

            if (error) throw error

            alert('Order deleted.')
            router.push(`/clients/${clientId}`)

        } catch (error) {
            console.error('Error deleting order:', error)
            alert('Failed to delete: ' + error.message)
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ padding: '1.5rem 1rem', textAlign: 'center', paddingTop: '3rem' }}>
                <HamburgerMenu />
                <p style={{ color: '#a1a1aa' }}>Loading order details...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container" style={{ padding: '1.5rem 1rem', textAlign: 'center', paddingTop: '3rem' }}>
                <HamburgerMenu />
                <p style={{ color: '#f87171' }}>Order not found.</p>
                <Link href={`/clients/${clientId}`} className="btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Back to Client
                </Link>
            </div>
        )
    }

    return (
        <div className="container" style={{ padding: '3.5rem 1rem 1.5rem', maxWidth: '600px' }}>
            <HamburgerMenu />

            {/* Header / Back */}
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href={`/clients/${clientId}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors" style={{ fontSize: '0.875rem' }}>
                    <ArrowLeft size={18} />
                    Back to {client?.full_name || 'Client'}
                </Link>
            </div>

            {/* Order Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Order Details</h1>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link
                            href={`/clients/${clientId}/edit-item/${orderId}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                color: '#a1a1aa',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'color 0.2s'
                            }}
                            className="hover:text-white"
                        >
                            <Pencil size={16} />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                color: '#f87171',
                                background: 'none',
                                border: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'color 0.2s'
                            }}
                            className="hover:text-red-300"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
                <p style={{ color: '#71717a', fontSize: '0.875rem', margin: 0 }}>
                    Created {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Image */}
            {order.image_url && (
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: '480px',
                    backgroundImage: `url('${order.image_url}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(63, 63, 70, 0.5)'
                }}></div>
            )}

            {/* Measurements */}
            <div style={{
                background: 'var(--surface)',
                border: '1px solid rgba(63, 63, 70, 0.5)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '1rem'
            }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Measurements</h2>

                {/* Upper Body */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.8125rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Upper Body</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem' }}>
                        {[
                            { label: 'Bust', key: 'bust' },
                            { label: 'Chest', key: 'chest' },
                            { label: 'Shoulder', key: 'shoulder' },
                            { label: 'Arm Hole', key: 'arm_hole' },
                            { label: 'Sleeve Length', key: 'sleeve_length' },
                            { label: 'Sleeve Width', key: 'sleeve_width' },
                            { label: 'Collar', key: 'collar' },
                            { label: 'Neckline', key: 'neckline' },
                        ].map(f => order[f.key] && (
                            <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderBottom: '1px solid rgba(63, 63, 70, 0.3)', paddingBottom: '4px' }}>
                                <span style={{ color: '#a1a1aa' }}>{f.label}</span>
                                <span style={{ color: '#ededed', fontWeight: 500 }}>{order[f.key]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lower Body */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.8125rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Lower Body</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem' }}>
                        {[
                            { label: 'Waist', key: 'waist' },
                            { label: 'Skirt Waist', key: 'skirt_waist' },
                            { label: 'Trouser Waist', key: 'trouser_waist' },
                            { label: 'Hip', key: 'hip' },
                            { label: 'Seat', key: 'seat' },
                            { label: 'Crotch', key: 'crotch' },
                            { label: 'Bottom', key: 'bottom' },
                            { label: 'Cuff', key: 'cuff' },
                        ].map(f => order[f.key] && (
                            <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderBottom: '1px solid rgba(63, 63, 70, 0.3)', paddingBottom: '4px' }}>
                                <span style={{ color: '#a1a1aa' }}>{f.label}</span>
                                <span style={{ color: '#ededed', fontWeight: 500 }}>{order[f.key]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lengths & Full Body */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.8125rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Lengths & Full Body</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem' }}>
                        {[
                            { label: 'Shirt Length', key: 'shirt_length' },
                            { label: 'Blouse Length', key: 'blouse_length' },
                            { label: 'Skirt Length', key: 'skirt_length' },
                            { label: 'Trouser Length', key: 'trouser_length' },
                            { label: 'Shorts Length', key: 'shorts_length' },
                            { label: 'Jacket Length', key: 'jacket_length' },
                            { label: 'Kaftan Length', key: 'kaftan_dress_length' },
                            { label: 'Dress', key: 'dress' },
                            { label: 'Jumpsuit', key: 'jumpsuit' },
                        ].map(f => order[f.key] && (
                            <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderBottom: '1px solid rgba(63, 63, 70, 0.3)', paddingBottom: '4px' }}>
                                <span style={{ color: '#a1a1aa' }}>{f.label}</span>
                                <span style={{ color: '#ededed', fontWeight: 500 }}>{order[f.key]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Extra Details */}
            {order.extra_details && (
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid rgba(63, 63, 70, 0.5)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '3rem'
                }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Additional Notes</h2>
                    <p style={{ color: '#d4d4d8', fontSize: '0.9375rem', lineHeight: '1.6', margin: 0 }}>
                        {order.extra_details}
                    </p>
                </div>
            )}

            <div style={{ paddingBottom: '2rem' }}></div>
        </div>
    )
}
