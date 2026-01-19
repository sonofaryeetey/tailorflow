"use client"

import { useEffect, useState, use } from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import MultiStepForm from '@/components/MultiStepForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import HamburgerMenu from '@/components/HamburgerMenu'

export default function AddOrderPage({ params }) {
    const { id } = use(params)
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            fetchClient()
        }
    }, [id])

    const fetchClient = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setClient(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="container py-12 text-center text-zinc-400">
            <HamburgerMenu />
            Loading...
        </div>
    )

    if (!client) return (
        <div className="container py-12 text-center text-red-400">
            <HamburgerMenu />
            Client not found
        </div>
    )

    return (
        <main style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <HamburgerMenu />
            <div className="container mb-4">
                <Link href={`/clients/${id}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    Back to Client
                </Link>
            </div>

            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Add Order</h1>
                <p>Adding new items for <span className="font-bold text-white">{client.full_name}</span></p>
            </header>

            <MultiStepForm existingClient={client} />
        </main>
    )
}
