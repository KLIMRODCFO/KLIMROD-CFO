'use client'

import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { restaurants } from '@/app/lib/restaurants'

interface ClosedEvent {
  id: string
  timestamp: string
  restaurantId?: string
  restaurantName?: string
  eventInfo: {
    date: string
    day: string
    eventName: string
    shift: string
    manager: string
    otherFee: number
    notes: string
  }
  salesData: any[]
  expenseData: any[]
  otherFeeData: any[]
  totals: any
  expenseTotals: any
  tipDistribution: any[]
  distributionMethod: string
}

export default function ClosedEventsPage() {
  const [events, setEvents] = useState<ClosedEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<ClosedEvent | null>(null)
  const [activeRestaurant, setActiveRestaurant] = useState<string>('')
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')

  useEffect(() => {
    const updateActiveRestaurant = () => {
      const stored = localStorage.getItem('active_restaurant_id')
      if (stored) {
        const restaurant = restaurants.find(r => r.id === stored)
        if (restaurant) {
          setActiveRestaurant(restaurant.name)
          setActiveRestaurantId(stored)
        }
      }
    }
    updateActiveRestaurant()

    // Listen for changes
    window.addEventListener('restaurant-changed', updateActiveRestaurant)
    return () => {
      window.removeEventListener('restaurant-changed', updateActiveRestaurant)
    }
  }, [])

  useEffect(() => {
    if (!activeRestaurantId) return
    
    const stored = localStorage.getItem('closed_events')
    if (stored) {
      const parsedEvents = JSON.parse(stored)
      
      // Migrate old events without restaurantId to TUCCI (REST1)
      let needsUpdate = false
      const migratedEvents = parsedEvents.map((event: ClosedEvent) => {
        if (!event.restaurantId) {
          needsUpdate = true
          return {
            ...event,
            restaurantId: 'REST1',
            restaurantName: 'TUCCI'
          }
        }
        return event
      })
      
      // Save migrated events if needed
      if (needsUpdate) {
        localStorage.setItem('closed_events', JSON.stringify(migratedEvents))
      }
      
      // Filter by active restaurant
      const filteredEvents = migratedEvents.filter((event: ClosedEvent) => 
        event.restaurantId === activeRestaurantId
      )
      // Sort by timestamp descending (newest first)
      filteredEvents.sort((a: ClosedEvent, b: ClosedEvent) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setEvents(filteredEvents)
    }
  }, [activeRestaurantId])

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      const updated = events.filter(e => e.id !== eventId)
      setEvents(updated)
      localStorage.setItem('closed_events', JSON.stringify(updated))
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null)
      }
    }
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full px-6 py-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-black">CLOSED EVENTS</h1>
            {activeRestaurant && (
              <p className="text-lg font-semibold text-gray-600 mt-1">{activeRestaurant}</p>
            )}
          </div>
          <button
            onClick={() => window.location.href = '/sales-report'}
            className="px-4 py-2 bg-gray-900 text-white rounded font-semibold text-sm hover:bg-gray-800 transition"
          >
            ← BACK TO SALES REPORT
          </button>
        </div>

        {!activeRestaurantId ? (
          <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
            <p className="text-gray-500 text-lg">Please select a restaurant in Business Unit first</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
            <p className="text-gray-500 text-lg">No closed events yet for {activeRestaurant}</p>
            <p className="text-gray-400 text-sm mt-2">Submit a sales report to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 uppercase">
                      {event.eventInfo.eventName}
                    </h2>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">Date:</span>
                        <p className="text-gray-900">{event.eventInfo.date}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Day:</span>
                        <p className="text-gray-900 uppercase">{event.eventInfo.day}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Shift:</span>
                        <p className="text-gray-900 uppercase">{event.eventInfo.shift}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Manager:</span>
                        <p className="text-gray-900 uppercase">{event.eventInfo.manager}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold">NET SALES</p>
                        <p className="text-lg font-bold text-green-700">
                          ${event.totals.totalNetSales.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold">TOTAL GRATUITY</p>
                        <p className="text-lg font-bold text-blue-700">
                          ${event.totals.totalGratuity.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold">HOUSE CASH</p>
                        <p className="text-lg font-bold text-purple-700">
                          ${(event.totals.totalCashSales - event.expenseTotals.totalCash).toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold">TOTAL EXPENSES</p>
                        <p className="text-lg font-bold text-orange-700">
                          ${event.expenseTotals.totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Submitted: {formatDate(event.timestamp)}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 uppercase">
                  {selectedEvent.eventInfo.eventName}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* Event Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">EVENT INFORMATION</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Date:</span> {selectedEvent.eventInfo.date}</div>
                    <div><span className="font-semibold">Day:</span> {selectedEvent.eventInfo.day}</div>
                    <div><span className="font-semibold">Shift:</span> {selectedEvent.eventInfo.shift}</div>
                    <div><span className="font-semibold">Manager:</span> {selectedEvent.eventInfo.manager}</div>
                    {selectedEvent.eventInfo.otherFee > 0 && (
                      <div><span className="font-semibold">Other Fee:</span> ${selectedEvent.eventInfo.otherFee.toFixed(2)}</div>
                    )}
                  </div>
                  {selectedEvent.eventInfo.notes && (
                    <div className="mt-4">
                      <span className="font-semibold">Notes:</span>
                      <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded">{selectedEvent.eventInfo.notes}</p>
                    </div>
                  )}
                </div>

                {/* Sales Data */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">SALES DATA</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Employee</th>
                          <th className="px-3 py-2 text-right font-semibold">Net Sales</th>
                          <th className="px-3 py-2 text-right font-semibold">CC Gratuity</th>
                          <th className="px-3 py-2 text-right font-semibold">Cash Gratuity</th>
                          <th className="px-3 py-2 text-right font-semibold">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.salesData.map((row: any, idx: number) => (
                          <tr key={idx} className="border-t">
                            <td className="px-3 py-2">{row.employee}</td>
                            <td className="px-3 py-2 text-right">${row.netSales?.toFixed(2) || '0.00'}</td>
                            <td className="px-3 py-2 text-right">${row.ccGratuity?.toFixed(2) || '0.00'}</td>
                            <td className="px-3 py-2 text-right">${row.cashGratuity?.toFixed(2) || '0.00'}</td>
                            <td className="px-3 py-2 text-right">{row.points || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expenses */}
                {selectedEvent.expenseData.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">EXPENSES</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border border-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">Expense</th>
                            <th className="px-3 py-2 text-right font-semibold">Amount</th>
                            <th className="px-3 py-2 text-center font-semibold">Payment Method</th>
                            <th className="px-3 py-2 text-center font-semibold">Paid By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEvent.expenseData.map((row: any, idx: number) => (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2">{row.expenseName}</td>
                              <td className="px-3 py-2 text-right">${row.amount?.toFixed(2) || '0.00'}</td>
                              <td className="px-3 py-2 text-center">{row.paymentMethod}</td>
                              <td className="px-3 py-2 text-center">{row.paidBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
