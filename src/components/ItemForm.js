import { useState, useRef } from 'react'
import { Camera, Ruler, Plus, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

export default function ItemForm({ onAddLike, onReview, currentClientName, initialData, isEditing = false, onSave }) {
    const [item, setItem] = useState({
        // Upper Body
        bust: initialData?.bust || '',
        chest: initialData?.chest || '',
        shoulder: initialData?.shoulder || '',
        arm_hole: initialData?.arm_hole || '',
        sleeve_length: initialData?.sleeve_length || '',
        sleeve_width: initialData?.sleeve_width || '',
        collar: initialData?.collar || '',
        neckline: initialData?.neckline || '',
        // Lower Body
        waist: initialData?.waist || '',
        skirt_waist: initialData?.skirt_waist || '',
        trouser_waist: initialData?.trouser_waist || '',
        hip: initialData?.hip || '',
        seat: initialData?.seat || '',
        crotch: initialData?.crotch || '',
        bottom: initialData?.bottom || '',
        cuff: initialData?.cuff || '',
        // Lengths
        shirt_length: initialData?.shirt_length || '',
        blouse_length: initialData?.blouse_length || '',
        skirt_length: initialData?.skirt_length || '',
        trouser_length: initialData?.trouser_length || '',
        shorts_length: initialData?.shorts_length || '',
        jacket_length: initialData?.jacket_length || '',
        kaftan_dress_length: initialData?.kaftan_dress_length || '',
        // Full Body
        dress: initialData?.dress || '',
        jumpsuit: initialData?.jumpsuit || '',

        extra_details: initialData?.extra_details || '',
        image_url: initialData?.image_url || null,
        image_file: null
    })

    const [isCompressing, setIsCompressing] = useState(false)
    const [activeGroup, setActiveGroup] = useState('upper') // upper, lower, length, full
    const fileInputRef = useRef(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setItem(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setIsCompressing(true)
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true }

        try {
            const compressedFile = await imageCompression(file, options)
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
            console.error('Compression error:', error)
            setIsCompressing(false)
        }
    }

    const handleAddAnother = (e) => {
        e.preventDefault()
        onAddLike(item)
        setItem({
            bust: '', chest: '', shoulder: '', arm_hole: '', sleeve_length: '', sleeve_width: '', collar: '', neckline: '',
            waist: '', skirt_waist: '', trouser_waist: '', hip: '', seat: '', crotch: '', bottom: '', cuff: '',
            shirt_length: '', blouse_length: '', skirt_length: '', trouser_length: '', shorts_length: '', jacket_length: '', kaftan_dress_length: '',
            dress: '', jumpsuit: '',
            extra_details: '',
            image_url: null,
            image_file: null
        })
        setActiveGroup('upper')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDone = (e) => {
        e.preventDefault()
        const hasData = Object.keys(item).some(key => key !== 'image_file' && key !== 'image_url' && item[key] !== '')
        if (hasData || item.image_file) {
            onAddLike(item)
        }
        onReview()
    }

    const groups = [
        { id: 'upper', label: 'Upper Body' },
        { id: 'lower', label: 'Lower Body' },
        { id: 'length', label: 'Lengths' },
        { id: 'full', label: 'Full Body' }
    ]

    const renderFields = () => {
        switch (activeGroup) {
            case 'upper':
                return (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in">
                        <div className="flex flex-col gap-1"><label>Bust</label><input name="bust" value={item.bust} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Chest</label><input name="chest" value={item.chest} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Shoulder</label><input name="shoulder" value={item.shoulder} onChange={handleChange} placeholder="Across back" /></div>
                        <div className="flex flex-col gap-1"><label>Arm Hole</label><input name="arm_hole" value={item.arm_hole} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Sleeve Length</label><input name="sleeve_length" value={item.sleeve_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Sleeve Width</label><input name="sleeve_width" value={item.sleeve_width} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Collar</label><input name="collar" value={item.collar} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Neckline</label><input name="neckline" value={item.neckline} onChange={handleChange} placeholder="0" /></div>
                    </div>
                )
            case 'lower':
                return (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in">
                        <div className="flex flex-col gap-1"><label>Waist</label><input name="waist" value={item.waist} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Skirt Waist</label><input name="skirt_waist" value={item.skirt_waist} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Trouser Waist</label><input name="trouser_waist" value={item.trouser_waist} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Hip</label><input name="hip" value={item.hip} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Seat</label><input name="seat" value={item.seat} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Crotch</label><input name="crotch" value={item.crotch} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Bottom</label><input name="bottom" value={item.bottom} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Cuff</label><input name="cuff" value={item.cuff} onChange={handleChange} placeholder="0" /></div>
                    </div>
                )
            case 'length':
                return (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in">
                        <div className="flex flex-col gap-1"><label>Shirt Length</label><input name="shirt_length" value={item.shirt_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Blouse Length</label><input name="blouse_length" value={item.blouse_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Skirt Length</label><input name="skirt_length" value={item.skirt_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Trouser Length</label><input name="trouser_length" value={item.trouser_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Shorts Length</label><input name="shorts_length" value={item.shorts_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Jacket Length</label><input name="jacket_length" value={item.jacket_length} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Kaftan length</label><input name="kaftan_dress_length" value={item.kaftan_dress_length} onChange={handleChange} placeholder="0" /></div>
                    </div>
                )
            case 'full':
                return (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in">
                        <div className="flex flex-col gap-1"><label>Dress</label><input name="dress" value={item.dress} onChange={handleChange} placeholder="0" /></div>
                        <div className="flex flex-col gap-1"><label>Jumpsuit</label><input name="jumpsuit" value={item.jumpsuit} onChange={handleChange} placeholder="0" /></div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="card animate-fade-in" style={{ padding: '2rem 1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Item Measurements</h2>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '2rem' }}>
                Adding item for <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{currentClientName}</span>
            </p>

            <div className="flex flex-col gap-10">

                {/* Image Upload Area */}
                <div
                    className="flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-700 rounded-lg p-8 cursor-pointer hover:border-zinc-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        background: item.image_url ? `url(${item.image_url}) center/cover no-repeat` : 'rgba(39, 39, 42, 0.5)',
                        height: '220px',
                        borderStyle: item.image_url ? 'solid' : 'dashed',
                        marginBottom: '0.5rem' // Extra space before group selector
                    }}
                >
                    {item.image_url ? (
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.625rem 1.25rem', borderRadius: '24px', backdropFilter: 'blur(4px)' }}>
                            <p style={{ color: 'white', margin: 0, fontSize: '0.875rem' }}>Change Image</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Camera size={32} className="text-zinc-500" />
                            <p className="text-zinc-500 text-sm m-0 font-medium">Upload item photo</p>
                        </div>
                    )}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} hidden />
                    {isCompressing && <p className="text-primary text-xs mt-3">Compressing...</p>}
                </div>

                {/* Group Selector */}
                <div style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginBottom: '0.5rem' }}>
                    {groups.map(group => (
                        <button
                            key={group.id}
                            onClick={(e) => { e.preventDefault(); setActiveGroup(group.id) }}
                            style={{
                                padding: '0.625rem 1.25rem',
                                borderRadius: '20px',
                                fontSize: '0.8125rem',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                background: activeGroup === group.id ? 'var(--primary)' : 'rgba(39, 39, 42, 0.5)',
                                color: activeGroup === group.id ? 'black' : '#a1a1aa',
                                border: '1px solid',
                                borderColor: activeGroup === group.id ? 'var(--primary)' : 'rgba(63, 63, 70, 0.3)',
                                fontWeight: activeGroup === group.id ? 600 : 400,
                                cursor: 'pointer'
                            }}
                        >
                            {group.label}
                        </button>
                    ))}
                </div>

                {/* Fields Section */}
                <div style={{ minHeight: '260px' }}>
                    {renderFields()}
                </div>

                {/* Extra Details */}
                <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: '#a1a1aa', display: 'block', marginBottom: '0.75rem' }}>Additional Notes</label>
                    <textarea
                        name="extra_details"
                        value={item.extra_details}
                        onChange={handleChange}
                        placeholder="Fabric type, special cuts, style notes..."
                        rows={4}
                        style={{ fontSize: '0.9375rem', lineHeight: '1.5' }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 mt-4">
                    {!isEditing && (
                        <button onClick={handleAddAnother} className="btn-secondary flex items-center justify-center gap-2" style={{ padding: '1rem' }}>
                            <Plus size={18} />
                            Add & Another
                        </button>
                    )}

                    {isEditing ? (
                        <button onClick={(e) => { e.preventDefault(); onSave(item) }} className="btn-primary" style={{ padding: '1rem' }}>
                            Update Item
                        </button>
                    ) : (
                        <button onClick={handleDone} className="btn-primary" style={{ padding: '1rem' }}>
                            Review &rarr;
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}
