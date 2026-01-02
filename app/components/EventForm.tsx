'use client'

import { Event, Shift, DayOfWeek } from '@/app/lib/types'
import { useState } from 'react'

const SHIFTS: Shift[] = ['LUNCH', 'BRUNCH', 'DINNER', 'NIGHT']
const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

interface EventFormProps {
  event: Event
  onChange: (event: Event) => void
  onSubmit: (event: Event) => void
  loading?: boolean
}

export default function EventForm({ event, onChange, onSubmit, loading = false }: EventFormProps) {
  const handleChange = (field: keyof Event, value: any) => {
    onChange({
      ...event,
      [field]: value,
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(event)
      }}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={event.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <select
            value={event.day}
            onChange={(e) => handleChange('day', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={event.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Shift */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
          <select
            value={event.shift}
            onChange={(e) => handleChange('shift', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a shift</option>
            {SHIFTS.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <input
            type="text"
            placeholder="EVENT 1"
            value={event.eventName}
            onChange={(e) => handleChange('eventName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Manager */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
          <input
            type="text"
            placeholder="Manager Name"
            value={event.manager}
            onChange={(e) => handleChange('manager', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Saving...' : 'Save Event'}
      </button>
    </form>
  )
}
