'use client'

import { Suspense } from 'react'
import SalesReportContent from './client'
import ProtectedRoute from '@/app/components/ProtectedRoute'

export default function SalesReportPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          </div>
        </div>
      }>
        <SalesReportContent />
      </Suspense>
    </ProtectedRoute>
  )
}



