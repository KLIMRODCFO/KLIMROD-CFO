'use client'

import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { useEffect, useState } from 'react'
import { restaurants, Restaurant } from '@/app/lib/restaurants'

export default function BusinessUnitPage() {
  const [activeId, setActiveId] = useState<string>('')
  const [portfolio, setPortfolio] = useState<Restaurant[]>(restaurants)

  useEffect(() => {
    const stored = localStorage.getItem('active_restaurant_id')
    if (stored) setActiveId(stored)
  }, [])

  const activateRestaurant = (id: string) => {
    setActiveId(id)
    localStorage.setItem('active_restaurant_id', id)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('restaurant-changed'))
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-black mb-6">BUSINESS UNIT</h1>
        <p className="text-gray-700 mb-6">Selecciona la unidad de negocio activa para que todos los módulos (Sales Report, Menu, Inventory, etc.) se ajusten a tu elección.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolio.map((rest) => (
            <div key={rest.id} className="border-2 border-black rounded p-4 bg-white flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">ID: {rest.id}</p>
                  <h2 className="text-xl font-bold text-black">{rest.name}</h2>
                  <p className="text-sm text-gray-700">{rest.city}</p>
                  <p className="text-sm text-gray-700">GM: {rest.gm}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${rest.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                  {rest.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
              <button
                onClick={() => activateRestaurant(rest.id)}
                className={`px-4 py-2 rounded font-semibold border-2 ${
                  activeId === rest.id ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                {activeId === rest.id ? 'ACTIVO PARA TODO EL APP' : 'ESTABLECER COMO ACTIVO'}
              </button>
              <p className="text-xs text-gray-600">El restaurante activo se usará para asociar HR, Sales, Inventory y Finanzas.</p>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
