'use client'

import { useState, useEffect } from 'react'
import { Event, DayOfWeek, Shift } from '@/app/lib/types'
import EventForm from '@/app/components/EventForm'
import ProtectedRoute from '@/app/components/ProtectedRoute'

function EventsPageContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Event>({
    date: new Date().toISOString().split('T')[0],
    day: 'MONDAY',
    year: new Date().getFullYear(),
    eventName: '',
    shift: 'LUNCH',
    manager: '',
  })

  // Load events from localStorage (placeholder for Supabase)
  useEffect(() => {
    const stored = localStorage.getItem('events')
    if (stored) {
      setEvents(JSON.parse(stored))
    }
  }, [])

  // Save events to localStorage (placeholder for Supabase)
  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents)
    localStorage.setItem('events', JSON.stringify(updatedEvents))
  }

  const handleCreateEvent = (event: Event) => {
    const eventWithId = {
      ...event,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    saveEvents([...events, eventWithId])
    setShowForm(false)
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      day: 'MONDAY',
      year: new Date().getFullYear(),
      eventName: '',
      shift: 'LUNCH',
      manager: '',
    })
  }

  const handleDeleteEvent = (id: string | undefined) => {
    if (id) {
      saveEvents(events.filter((e) => e.id !== id))
      if (selectedEvent?.id === id) {
        setSelectedEvent(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Events Management</h1>

        {/* Create Event Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : '+ Create New Event'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <EventForm
              event={newEvent}
              onChange={setNewEvent}
              onSubmit={handleCreateEvent}
            />
          </div>
        )}

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-6 rounded-lg shadow-md cursor-pointer transition ${
                selectedEvent?.id === event.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border-2 border-transparent hover:border-blue-300'
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{event.eventName}</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span> {event.date} ({event.day})
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Year:</span> {event.year}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Shift:</span> {event.shift}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Manager:</span> {event.manager}
                </p>
                <div className="pt-4 flex gap-3">
                  <a
                    href={`/events/details?eventId=${event.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center font-medium hover:bg-blue-700 transition"
                  >
                    View Details
                  </a>
                  <a
                    href={`/sales?eventId=${event.id}`}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-center font-medium hover:bg-green-700 transition"
                  >
                    Quick Add Sales
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteEvent(event.id)
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events created yet. Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <EventsPageContent />
    </ProtectedRoute>
  )
}
