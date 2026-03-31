import { Label } from '../typography/Typography'

  interface InputProps {
    label: string
    type?: 'text' | 'password'
    value: string
    onChange: (value: string) => void
  }

  function Input({ label, type = 'text', value, onChange }: InputProps) {
    return (
      <div className="input-group">
        <Label>{label}</Label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    )
  }

  export default Input