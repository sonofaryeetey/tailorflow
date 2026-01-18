import { useState, useRef } from 'react'
import { Camera, Ruler, Plus, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

export default function ItemForm({ onAddLike, onReview, currentClientName, initialData, isEditing = false, onSave }) {
    const [item, setItem] = useState({
        waist: initialData?.waist || '',
        sleeve: initialData?.sleeve || '',
        leg_length: initialData?.leg_length || '',
        hip: initialData?.hip || '',
        thigh: initialData?.thigh || '',
        extra_details: initialData?.extra_details || '',
        image_url: initialData?.image_url || null,
        image_file: null // The actual file to upload
    })

    const [isCompressing, setIsCompressing] = useState(false)
    const fileInputRef = useRef(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setItem(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setIsCompressing(true)

        // Compression options for Supabase Free Tier optimization
        const options = {
            maxSizeMB: 0.5, // 500KB max
            maxWidthOrHeight: 1200,
            useWebWorker: true
        }

        try {
            const compressedFile = await imageCompression(file, options)

            // Create preview
            const reader = new FileReader()
            reader.readAsDataURL(compressedFile)
            reader.onloadend = () => {
                setItem(prev => ({
                    ...prev,
                    image_url: reader.result,
                    image_file: compressedFile
                }))
                setIsCompressing(false)
            }
        } catch (error) {
            console.error('Compression ended:', error)
            setIsCompressing(false)
        }
    }

    const handleAddAnother = (e) => {
        e.preventDefault()
        // Validation: Require at least one measurement or image?
        // For now, loose validation.
        onAddLike(item)
        // Reset form for next item
        setItem({
            waist: '',
            sleeve: '',
            leg_length: '',
            hip: '',
            thigh: '',
            extra_details: '',
            image_url: null,
            image_file: null
        })
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDone = (e) => {
        e.preventDefault()
        // If there is data in the form, add it before moving to review
        // Unless the form is empty
        const hasData = Object.values(item).some(val => val && val !== '')
        if (hasData) {
            // Ideally we might want to ask confirmation, but for now we'll just add it if valid
            if (item.waist || item.image_file) {
                onAddLike(item)
            }
        }
        onReview()
    }

    return (
        <div className="card animate-fade-in">
            <h2>Item Details</h2>
            <p>Adding item for <span style={{ color: 'var(--primary)' }}>{currentClientName}</span></p>

            <div className="flex flex-col gap-4 mt-4">

                {/* Image Upload Area */}
                <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-6 cursor-pointer hover:border-zinc-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: item.image_url ? `url(${item.image_url}) center/cover no-repeat` : 'transparent', height: '200px' }}
                >
                    {item.image_url ? (
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '8px' }}>
                            <p style={{ color: 'white', margin: 0 }}>Click to change image</p>
                        </div>
                    ) : (
                        <>
                            <Camera size={32} className="mb-2 text-zinc-400" />
                            <p className="text-zinc-400 text-sm m-0">Tap to take photo or upload</p>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        hidden
                    />
                    {isCompressing && <p className="text-primary text-xs mt-2">Compressing...</p>}
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Waist (cm/in)</label>
                        <input name="waist" value={item.waist} onChange={handleChange} placeholder="0" />
                    </div>
                    <div>
                        <label>Hip (cm/in)</label>
                        <input name="hip" value={item.hip} onChange={handleChange} placeholder="0" />
                    </div>
                    <div>
                        <label>Thigh (cm/in)</label>
                        <input name="thigh" value={item.thigh} onChange={handleChange} placeholder="0" />
                    </div>
                    <div>
                        <label>Leg Length (cm/in)</label>
                        <input name="leg_length" value={item.leg_length} onChange={handleChange} placeholder="0" />
                    </div>
                    <div>
                        <label>Sleeve (cm/in)</label>
                        <input name="sleeve" value={item.sleeve} onChange={handleChange} placeholder="0" />
                    </div>
                </div>

                {/* Extra Details */}
                <div>
                    <label>Extra Details</label>
                    <textarea
                        name="extra_details"
                        value={item.extra_details}
                        onChange={handleChange}
                        placeholder="Fabric type, colors, special cuts..."
                        rows={3}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                    {!isEditing && (
                        <button onClick={handleAddAnother} className="btn-secondary flex items-center justify-center gap-2">
                            <Plus size={18} />
                            Add This Item & Add Another
                        </button>
                    )}

                    {isEditing ? (
                        <button onClick={(e) => { e.preventDefault(); onSave(item) }} className="btn-primary mt-2">
                            Save Changes
                        </button>
                    ) : (
                        <button onClick={handleDone} className="btn-primary mt-2">
                            Done & Review &rarr;
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}
