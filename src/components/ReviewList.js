import { Trash2, Edit2, Send } from 'lucide-react'

export default function ReviewList({ clientData, items, onBack, onSave, onEditItem }) {
    const totalItems = items.length

    return (
        <div className="animate-fade-in">
            <div className="card mb-4">
                <h2 style={{ fontSize: '1.25rem' }}>Client Summary</h2>
                <div className="flex flex-col gap-1 mt-2">
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Name</span>
                        <span className="font-medium">{clientData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Phone</span>
                        <span>{clientData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Location</span>
                        <span>{clientData.location}</span>
                    </div>
                </div>
            </div>

            <h3 className="mb-4">Clothing Items ({totalItems})</h3>

            <div className="flex flex-col gap-4 mb-8">
                {items.map((item, index) => (
                    <div key={index} className="card relative flex gap-4 p-4">
                        {/* Thumbnail */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: item.image_url ? `url(${item.image_url}) center/cover` : '#27272a',
                            borderRadius: '8px',
                            flexShrink: 0
                        }}></div>

                        {/* Details */}
                        <div className="flex-1">
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Item #{index + 1}</h4>
                            <p className="text-sm text-zinc-400 mb-0 line-clamp-2">
                                {item.extra_details || 'No additional details'}
                            </p>
                            <div className="text-xs text-zinc-500 mt-1">
                                {item.waist && `Waist: ${item.waist} `}
                                {item.sleeve && `Sleeve: ${item.sleeve}`}
                            </div>
                        </div>

                        {/* Actions */}
                        {/* Ideally implement delete/edit logic here */}
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={onBack} className="btn-outline flex-1">
                    Back
                </button>
                <button onClick={onSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Send size={18} />
                    Save All
                </button>
            </div>
        </div>
    )
}
