"use client"

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../../lib/supabaseClient'
import ItemForm from '@/components/ItemForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import imageCompression from 'browser-image-compression'

export default function EditItemPage({ params }) {
    const { id, itemId } = use(params)
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [client, setClient] = useState(null)
    const [item, setItem] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (id && itemId) {
            loadData()
        }
    }, [id, itemId])

    const loadData = async () => {
        try {
            // Fetch Client
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('full_name')
                .eq('id', id)
                .single()

            if (clientError) throw clientError
            setClient(clientData)

            // Fetch Item
            const { data: itemData, error: itemError } = await supabase
                .from('items')
                .select('*')
                .eq('id', itemId)
                .single()

            if (itemError) throw itemError
            setItem(itemData)

        } catch (error) {
            console.error('Error loading data:', error)
            alert('Error loading data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (updatedItem) => {
        setSaving(true)
        try {
            let finalImageUrl = updatedItem.image_url

            // Handle new image upload if changed
            if (updatedItem.image_file) {
                const fileName = `${id}/${Date.now()}-edit-${Math.random().toString(36).substring(7)}`
                const { error: uploadError } = await supabase
                    .storage
                    .from('item-images')
                    .upload(fileName, updatedItem.image_file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage.from('item-images').getPublicUrl(fileName)
                finalImageUrl = publicUrl
            }

            // Update Item
            const { data, error: updateError } = await supabase
                .from('items')
                .update({
                    waist: updatedItem.waist,
                    sleeve: updatedItem.sleeve,
                    leg_length: updatedItem.leg_length,
                    hip: updatedItem.hip,
                    thigh: updatedItem.thigh,
                    extra_details: updatedItem.extra_details,
                    image_url: finalImageUrl
                })
                .eq('id', itemId)
                .select()

            if (updateError) throw updateError
            if (!data || data.length === 0) {
                throw new Error('Update failed. Permission denied or item not found. Did you run the RLS policy?')
            }

            alert('Item updated successfully!')
            // Force hard reload to ensure data is fresh
            window.location.href = `/clients/${id}`

        } catch (error) {
            console.error('Error updating item:', error)
            alert('Failed to update item: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="container py-12 text-center text-zinc-400">Loading...</div>
    if (!client || !item) return <div className="container py-12 text-center text-red-400">Item not found</div>

    return (
        <main style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container mb-4">
                <Link href={`/clients/${id}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    Back to Client
                </Link>
            </div>

            <div className="container" style={{ maxWidth: '600px' }}>
                <h1 className="text-2xl mb-6">Edit Item</h1>
                <ItemForm
                    currentClientName={client.full_name}
                    initialData={item}
                    isEditing={true}
                    onSave={handleSave}
                />
            </div>
            {saving && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="text-white">Saving changes...</div>
                </div>
            )}
        </main>
    )
}
