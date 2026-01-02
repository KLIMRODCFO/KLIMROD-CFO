'use client'

import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { Event } from '@/app/lib/types'
import Link from 'next/link'

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('events')
    if (stored) {
      const parsedEvents = JSON.parse(stored)
      setEvents(parsedEvents)
      if (parsedEvents.length > 0) {
        setSelectedEvent(parsedEvents[0])
      }
    }
  }, [])

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">KLIMROD CFO</h1>
          <p className="text-gray-600">Gestión de eventos y ventas</p>
        </div>

        {/* Event Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-4">Selecciona un evento:</h2>
          <div className="flex flex-wrap gap-2">
            {events.length > 0 ? (
              events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    selectedEvent?.id === event.id
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-black border-2 border-black hover:bg-gray-100'
                  }`}
                >
                  {event.eventName} ({event.date})
                </button>
              ))
            ) : (
              <p className="text-gray-500">No hay eventos creados</p>
            )}
          </div>
          <Link
            href="/events"
            className="inline-block mt-4 px-6 py-2 bg-blue-900 text-white rounded font-semibold hover:bg-blue-800"
          >
            + Crear Evento
          </Link>
        </div>

        {/* Main Content Area */}
        {selectedEvent ? (
          <div className="space-y-6">
            {/* Section 1: Event Information */}
            <div className="border-2 border-black p-6 bg-white">
              <h2 className="text-xl font-bold text-black mb-4">
                INFORMACIÓN GENERAL DEL EVENTO
              </h2>
              <p className="text-gray-600 mb-4">(A completar por el manager)</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Evento:
                  </label>
                  <p className="text-gray-700 font-medium">{selectedEvent.eventName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Fecha:
                  </label>
                  <p className="text-gray-700 font-medium">{selectedEvent.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Turno:
                  </label>
                  <p className="text-gray-700 font-medium">{selectedEvent.shift}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Manager:
                  </label>
                  <p className="text-gray-700 font-medium">{selectedEvent.manager}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Día:
                  </label>
                  <p className="text-gray-700 font-medium">{selectedEvent.day}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Año:
                  </label>
                  <p className="text-gray-700 font-medium">{selectedEvent.year}</p>
                </div>
              </div>

              <Link
                href={`/events/details?id=${selectedEvent.id}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-900 text-white rounded font-semibold hover:bg-blue-800"
              >
                Editar Evento
              </Link>
            </div>

            {/* Section 2: Employee Information */}
            <div className="border-2 border-black p-6 bg-white">
              <h2 className="text-xl font-bold text-black mb-4">
                INFORMACIÓN DE LOS EMPLEADOS QUE TRABAJARON EL EVENTO
              </h2>
              <p className="text-gray-600 mb-4">(A completar también con el manager)</p>

              <div className="bg-gray-100 p-8 rounded text-center min-h-64 flex items-center justify-center">
                <div className="text-gray-500">
                  <p className="font-semibold mb-2">
                    Accede a la sección de SALES REPORT para registrar
                  </p>
                  <p className="text-sm">
                    las ventas y comisiones de los empleados
                  </p>
                  <Link
                    href="/sales-report"
                    className="inline-block mt-4 px-6 py-2 bg-blue-900 text-white rounded font-semibold hover:bg-blue-800"
                  >
                    Ir a Sales Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-black p-8 bg-white text-center">
            <p className="text-gray-500 text-lg">Crea un evento para comenzar</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
