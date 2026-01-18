import { useState } from 'react'
import { User, MapPin, Phone } from 'lucide-react'

export default function ClientForm({ initialData = {}, onNext }) {
    const [formData, setFormData] = useState({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        location: initialData.location || ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.fullName.trim()) newErrors.fullName = 'Name is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
        if (!formData.location.trim()) newErrors.location = 'Location is required'
        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        onNext(formData)
    }

    return (
        <div className="card animate-fade-in">
            <h2>Client Information</h2>
            <p>Please enter the client's details to calculate the perfect fit.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">

                {/* Full Name */}
                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="e.g. Jane Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={{ paddingLeft: '2.5rem' }}
                            className={errors.fullName ? 'border-red' : ''}
                        />
                    </div>
                    {errors.fullName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.fullName}</span>}
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone">Phone Number</label>
                    <div style={{ position: 'relative' }}>
                        <Phone size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="e.g. +1 555 123 4567"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location">Location / Address</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="e.g. New York, NY"
                            value={formData.location}
                            onChange={handleChange}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    {errors.location && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.location}</span>}
                </div>

                <button type="submit" className="btn-primary mt-4">
                    Next Step &rarr;
                </button>
            </form>
        </div>
    )
}
