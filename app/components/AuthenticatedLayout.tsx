'use client'

import Sidebar from '@/app/components/Sidebar'
import Navbar from '@/app/components/Navbar'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { ReactNode } from 'react'

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gray-950 border-b border-gray-800">
            <Navbar />
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
