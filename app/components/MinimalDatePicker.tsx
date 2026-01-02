import { useState } from 'react'

function formatDate(val: string) {
  if (!val) return ''
  const [y, m, d] = val.split('-')
  if (!y || !m || !d) return val
  return `${m}/${d}/${y}`
}

export default function MinimalDatePicker({ value, onChange, name, required }: {
  value: string,
  onChange: (e: { target: { value: string, name: string } }) => void,
  name?: string,
  required?: boolean
}) {
  const [show, setShow] = useState(false)
  const [internal, setInternal] = useState(value)

  return (
    <div className="relative w-full flex items-center justify-center h-[32px]">
      <input
        type="date"
        value={internal}
        name={name}
        required={required}
        onChange={e => {
          setInternal(e.target.value)
          onChange({ target: { value: e.target.value, name: name || '' } })
        }}
        className="w-full h-full px-3 py-0 bg-white text-black border-0 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
        placeholder="MM/DD/YYYY"
        autoComplete="off"
        style={{ textAlign: 'center', verticalAlign: 'middle', direction: 'ltr' }}
      />
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 8px;
          left: auto;
          margin: 0;
          filter: invert(0.5);
          cursor: pointer;
        }
        input[type="date"]::-ms-input-placeholder { text-align: center; }
        input[type="date"]::placeholder { text-align: center; }
      `}</style>
    </div>
  )
}
