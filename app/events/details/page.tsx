'use client'

import { Suspense } from 'react'
import EventDetailsContent from './client'

export default function EventDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    }>
      <EventDetailsContent />
    </Suspense>
  )
}
