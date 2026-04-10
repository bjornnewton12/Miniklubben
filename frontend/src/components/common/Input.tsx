import { useState } from 'react'
import eyeOn from '../../assets/icons/Eye/EyeOn.svg'
import eyeOff from '../../assets/icons/Eye/EyeOff.svg'

interface InputProps {
    label: string
    type?: 'text' | 'password'
    value: string
    onChange: (value: string) => void
    showToggle?: boolean
}

function Input({ label, type = 'text', value, onChange, showToggle = false }: InputProps) {
    const [visible, setVisible] = useState(false)
    const inputType = type === 'password' && showToggle ? (visible ? 'text' : 'password') : type

    return (
        <div className="input-group">
            <span className="input-label">{label}</span>
            <div className="input-wrapper">
                <input
                    type={inputType}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
                {type === 'password' && showToggle && (
                    <button type="button" className="input-eye-toggle" onClick={() => setVisible(v => !v)}>
                        <img src={visible ? eyeOff : eyeOn} alt={visible ? 'Dölj lösenord' : 'Visa lösenord'} width="18" height="18" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input
