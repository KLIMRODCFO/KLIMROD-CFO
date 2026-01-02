import Image from 'next/image'

export default function KlimrodLogo({ size = 120 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Círculo exterior */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-black"
          />
          {/* Pequeños detalles decorativos */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.5"
            className="text-black"
          />
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-black">
          KLIMROD
        </h1>
        <p className="text-sm font-semibold tracking-wider text-gray-700">CFO</p>
      </div>
    </div>
  )
}
