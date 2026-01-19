"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClientForm from './ClientForm'
import ItemForm from './ItemForm'
import ReviewList from './ReviewList'
import { supabase } from '../lib/supabaseClient'

export default function MultiStepForm({ existingClient }) {
    // Normalize existing client data if present
    const initialClientData = existingClient ? {
        fullName: existingClient.full_name,
        phone: existingClient.phone,
        location: existingClient.location,
        id: existingClient.id
    } : null

    const router = useRouter()
    const [step, setStep] = useState(existingClient ? 2 : 1)
    const [clientData, setClientData] = useState(initialClientData)
    const [items, setItems] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleClientNext = (data) => {
        setClientData(data)
        setStep(2)
    }

    const handleAddItem = (itemData) => {
        setItems(prev => [...prev, itemData])
    }

    const handleReview = () => {
        setStep(3)
    }

    const handleBackToItems = () => {
        setStep(2)
    }

    const saveToSupabase = async () => {
        setIsSubmitting(true)
        setErrorMessage('')

        try {
            let clientId = clientData?.id

            // 1. Insert Client if not existing
            if (!clientId) {
                const { data: client, error: clientError } = await supabase
                    .from('clients')
                    .insert([{
                        full_name: clientData.fullName,
                        phone: clientData.phone,
                        location: clientData.location
                    }])
                    .select()
                    .single()

                if (clientError) throw clientError
                if (!client) throw new Error("Failed to create client")
                clientId = client.id
            }

            // 2. Upload Images and Insert Items
            console.log('Items to save:', items) // Debug: Check if image_file exists

            const itemPromises = items.map(async (item) => {
                let finalImageUrl = null

                // If there is a file, upload it
                if (item.image_file) {
                    console.log('Uploading file for item...')
                    const fileName = `${clientId}/${Date.now()}-${Math.random().toString(36).substring(7)}`
                    const { data: uploadData, error: uploadError } = await supabase
                        .storage
                        .from('item-images')
                        .upload(fileName, item.image_file)

                    if (uploadError) {
                        console.error("Image upload failed:", uploadError)
                    } else {
                        console.log("Upload successful:", uploadData)
                        // Get public URL
                        const { data: { publicUrl } } = supabase.storage.from('item-images').getPublicUrl(fileName)
                        console.log("Generated Public URL:", publicUrl)
                        finalImageUrl = publicUrl
                    }
                } else {
                    console.log('No image file found for this item')
                }

                return {
                    client_id: clientId,
                    bust: item.bust,
                    chest: item.chest,
                    shoulder: item.shoulder,
                    arm_hole: item.arm_hole,
                    sleeve_length: item.sleeve_length,
                    sleeve_width: item.sleeve_width,
                    collar: item.collar,
                    neckline: item.neckline,
                    waist: item.waist,
                    skirt_waist: item.skirt_waist,
                    trouser_waist: item.trouser_waist,
                    hip: item.hip,
                    seat: item.seat,
                    crotch: item.crotch,
                    bottom: item.bottom,
                    cuff: item.cuff,
                    shirt_length: item.shirt_length,
                    blouse_length: item.blouse_length,
                    skirt_length: item.skirt_length,
                    trouser_length: item.trouser_length,
                    shorts_length: item.shorts_length,
                    jacket_length: item.jacket_length,
                    kaftan_dress_length: item.kaftan_dress_length,
                    dress: item.dress,
                    jumpsuit: item.jumpsuit,
                    extra_details: item.extra_details,
                    image_url: finalImageUrl || null
                }
            })

            const itemsToInsert = await Promise.all(itemPromises)

            const { error: itemsError } = await supabase
                .from('items')
                .insert(itemsToInsert)

            if (itemsError) throw itemsError

            // Success! Reset or Show Success Page
            // Success!
            alert('Order Saved Successfully!')
            router.push('/')

        } catch (error) {
            console.error('Submission Error:', error)
            setErrorMessage('Failed to save data. Please try again. ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '1rem', marginTop: '2rem' }}>
            {/* Progress Indicator */}
            <div className="flex justify-between mb-8 px-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: step >= s ? 'var(--primary)' : 'var(--secondary)',
                            color: step >= s ? 'black' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}>
                            {s}
                        </div>
                        <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: step >= s ? 'white' : '#52525b' }}>
                            {s === 1 ? 'Client' : s === 2 ? 'Items' : 'Review'}
                        </span>
                    </div>
                ))}
            </div>

            {step === 1 && (
                <ClientForm
                    initialData={clientData || {}}
                    onNext={handleClientNext}
                />
            )}

            {step === 2 && (
                <ItemForm
                    currentClientName={clientData?.fullName}
                    onAddLike={handleAddItem}
                    onReview={handleReview}
                />
            )}

            {step === 3 && (
                <ReviewList
                    clientData={clientData}
                    items={items}
                    onBack={handleBackToItems}
                    onSave={saveToSupabase}
                />
            )}

            {isSubmitting && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="text-white">Saving order...</div>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 mt-4 bg-red-900/50 border border-red-500 rounded text-red-200">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}
