'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/authContext'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  // No mostrar navbar en página de login
  if (pathname?.includes('/auth/')) {
    return null
  }

  return (
    <nav className="bg-gray-950 text-white">
      <div className="w-full h-16 px-6 flex items-center justify-between">
        {/* Left placeholder to balance the centered logo */}
        <div className="w-48" />

        {/* Centered Logo */}
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white uppercase tracking-wider">
            <span>KLIMROD CFO</span>
          </Link>
        </div>

        {/* Right: user menu (kept in a fixed-width container) */}
        <div className="w-48 flex justify-end">
          {isAuthenticated && (
            <>
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-semibold text-white uppercase"
                >
                  <span className="text-sm">{user?.name}</span>
                  <span className="text-xs">▼</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-xs text-gray-500">Sesión activa</p>
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold transition"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
