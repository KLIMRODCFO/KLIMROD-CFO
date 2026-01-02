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
  }
  totals: {
    totalCcGratuity: number
    totalCashGratuity: number
    totalGratuity: number
    totalNetSales: number
  }
  tipDistribution?: Array<{
    employee: string
    ccGratuity: number
    cashGratuity: number
    tips: number
  }>
}

export default function PeriodSalesReportPage() {
  const [activeRestaurant, setActiveRestaurant] = useState<string>('')
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedShift, setSelectedShift] = useState<string>('ALL')
  const [events, setEvents] = useState<ClosedEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<ClosedEvent[]>([])

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
      const migratedEvents = parsedEvents.map((event: ClosedEvent) => {
        if (!event.restaurantId) {
          return { ...event, restaurantId: 'REST1', restaurantName: 'TUCCI' }
        }
        return event
      })
      const restaurantEvents = migratedEvents.filter((event: ClosedEvent) => 
        event.restaurantId === activeRestaurantId
      )
      setEvents(restaurantEvents)
    }
  }, [activeRestaurantId])

  useEffect(() => {
    filterEventsByPeriod()
  }, [startDate, endDate, selectedShift, events])

  const filterEventsByPeriod = () => {
    if (!events.length) {
      setFilteredEvents([])
      return
    }

    let filtered: ClosedEvent[] = []

    if (startDate && endDate) {
      filtered = events.filter(e => {
        const dateMatch = e.eventInfo.date >= startDate && e.eventInfo.date <= endDate
        const shiftMatch = selectedShift === 'ALL' || e.eventInfo.shift === selectedShift
        return dateMatch && shiftMatch
      })
    }

    filtered.sort((a, b) => a.eventInfo.date.localeCompare(b.eventInfo.date))
    setFilteredEvents(filtered)
  }

  const calculateTotals = () => {
    return filteredEvents.reduce(
      (acc, event) => ({
        ccGratuity: acc.ccGratuity + (event.totals?.totalCcGratuity || 0),
        cashGratuity: acc.cashGratuity + (event.totals?.totalCashGratuity || 0),
        totalGratuity: acc.totalGratuity + (event.totals?.totalGratuity || 0),
        netSales: acc.netSales + (event.totals?.totalNetSales || 0),
      }),
      { ccGratuity: 0, cashGratuity: 0, totalGratuity: 0, netSales: 0 }
    )
  }

  const calculateEmployeeTotals = () => {
    const employeeMap = new Map<string, { ccGratuity: number; cashGratuity: number; total: number }>()

    filteredEvents.forEach(event => {
      if (event.tipDistribution) {
        event.tipDistribution.forEach(tip => {
          const current = employeeMap.get(tip.employee) || { ccGratuity: 0, cashGratuity: 0, total: 0 }
          employeeMap.set(tip.employee, {
            ccGratuity: current.ccGratuity + (tip.ccGratuity || 0),
            cashGratuity: current.cashGratuity + (tip.cashGratuity || 0),
            total: current.total + (tip.tips || 0)
          })
        })
      }
    })

    return Array.from(employeeMap.entries())
      .map(([employee, totals]) => ({ employee, ...totals }))
      .sort((a, b) => b.total - a.total)
  }

  const totals = calculateTotals()
  const employeeTotals = calculateEmployeeTotals()

  return (
    <AuthenticatedLayout>
      <div className="w-full px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">PERIOD SALES REPORT</h1>
          {activeRestaurant && (
            <p className="text-lg font-semibold text-gray-600 mt-1">{activeRestaurant}</p>
          )}
        </div>

        {!activeRestaurantId ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Please select a restaurant in Business Unit first</p>
          </div>
        ) : (
          <>
            {/* Period Selector */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-black mb-4">SELECT PERIOD & FILTERS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">START DATE</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">END DATE</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">FILTER BY SHIFT</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded"
                >
                  <option value="ALL">ALL SHIFTS</option>
                  <option value="LUNCH">LUNCH</option>
                  <option value="BRUNCH">BRUNCH</option>
                  <option value="DINNER">DINNER</option>
                  <option value="NIGHT">NIGHT</option>
                </select>
              </div>
            </div>

            {/* Totals */}
            {filteredEvents.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">CC GRATUITY</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${totals.ccGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">CASH GRATUITY</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${totals.cashGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">TOTAL GRATUITY</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${totals.totalGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">NET SALES</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totals.netSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">EVENTS IN PERIOD ({filteredEvents.length})</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">DATE</th>
                          <th className="px-4 py-3 text-left font-semibold">DAY</th>
                          <th className="px-4 py-3 text-left font-semibold">EVENT</th>
                          <th className="px-4 py-3 text-left font-semibold">SHIFT</th>
                          <th className="px-4 py-3 text-right font-semibold">CC GRATUITY</th>
                          <th className="px-4 py-3 text-right font-semibold">CASH GRATUITY</th>
                          <th className="px-4 py-3 text-right font-semibold">TOTAL GRATUITY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.map((event) => (
                          <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{event.eventInfo.date}</td>
                            <td className="px-4 py-3 text-gray-900">{event.eventInfo.day}</td>
                            <td className="px-4 py-3 text-gray-900 font-semibold">{event.eventInfo.eventName}</td>
                            <td className="px-4 py-3 text-gray-900">{event.eventInfo.shift}</td>
                            <td className="px-4 py-3 text-right text-green-600 font-bold">
                              ${(event.totals?.totalCcGratuity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-blue-600 font-bold">
                              ${(event.totals?.totalCashGratuity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-purple-600 font-bold">
                              ${(event.totals?.totalGratuity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Employee Totals for Payroll */}
                {employeeTotals.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h2 className="text-xl font-bold text-black mb-4">EMPLOYEE GRATUITY TOTALS - PAYROLL</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-900 text-white">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">EMPLOYEE</th>
                            <th className="px-4 py-3 text-right font-semibold">CC GRATUITY</th>
                            <th className="px-4 py-3 text-right font-semibold">CASH GRATUITY</th>
                            <th className="px-4 py-3 text-right font-semibold">TOTAL GRATUITY</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeTotals.map((emp, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900 font-semibold">{emp.employee}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-bold">
                                ${emp.ccGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-right text-blue-600 font-bold">
                                ${emp.cashGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-right text-purple-600 font-bold">
                                ${emp.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                            <td className="px-4 py-3 text-gray-900">TOTAL</td>
                            <td className="px-4 py-3 text-right text-green-600">
                              ${totals.ccGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-blue-600">
                              ${totals.cashGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-purple-600">
                              ${totals.totalGratuity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {filteredEvents.length === 0 && startDate && endDate && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 text-lg">No events found in the selected period</p>
              </div>
            )}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
