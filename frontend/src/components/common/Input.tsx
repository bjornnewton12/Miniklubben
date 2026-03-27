import { Label } from '../typography/Typography'

  interface InputProps {
    label: string
    type?: 'text' | 'password'
    value: string
    onChange: (value: string) => void
  }

  function Input({ label, type = 'text', value, onChange }: InputProps) {
    return (
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="rounded-lg px-3 py-2 bg-white border border-gray-200 outline-none"
        />
      </div>
    )
  }

  export default Input