'use client'

import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { restaurants } from '@/app/lib/restaurants'

type TabKey = 'food' | 'beverage' | 'material'

export default function InventoryPage() {
  const [active, setActive] = useState<TabKey>('food')
  const [restaurantName, setRestaurantName] = useState<string>('')
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')

  // Read-only data from other systems
  const [ingredients, setIngredients] = useState<any[]>([])
  const [beverages, setBeverages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const updateData = () => {
      const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'
      setActiveRestaurantId(restaurantId)
      
      const restaurant = restaurants.find(r => r.id === restaurantId)
      if (restaurant) {
        setRestaurantName(restaurant.name)
      }

      // Load ingredients from Chef Management
      const ingredientsData = localStorage.getItem(`ingredients_${restaurantId}`)
      if (ingredientsData) setIngredients(JSON.parse(ingredientsData))

      // Load beverages from Sommelier Management
      const beveragesData = localStorage.getItem(`beverages_${restaurantId}`)
      if (beveragesData) setBeverages(JSON.parse(beveragesData))
    }

    updateData()
    window.addEventListener('restaurant-changed', updateData)
    
    // Refresh data every 5 seconds in case it changes in other tabs
    const interval = setInterval(updateData, 5000)
    
    return () => {
      window.removeEventListener('restaurant-changed', updateData)
      clearInterval(interval)
    }
  }, [])

  const filteredIngredients = ingredients.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBeverages = beverages.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'food', label: 'FOOD' },
    { id: 'beverage', label: 'BEVERAGE' },
    { id: 'material', label: 'MATERIAL' }
  ]

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-black mb-2">INVENTORY</h1>
        {restaurantName && (
          <p className="text-lg font-semibold text-gray-600 mb-4">{restaurantName}</p>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id as TabKey)}
              className={`px-4 py-3 border-2 font-semibold text-sm transition rounded ${
                active === tab.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="text-center">{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-900 px-4 py-2 rounded uppercase"
          />
        </div>

        {/* Content Area */}
        {active === 'food' && (
          <div>
            <h2 className="text-xl font-bold mb-4 uppercase">Food Ingredients from Chef Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-gray-900">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Par Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 uppercase">
                        No food ingredients found. Add ingredients in Chef Management.
                      </td>
                    </tr>
                  ) : (
                    filteredIngredients.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.category}</td>
                        <td className="px-4 py-3 text-sm">{item.unit}</td>
                        <td className="px-4 py-3 text-sm">{item.vendor}</td>
                        <td className="px-4 py-3 text-sm">${item.cost?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm">{item.parLevel || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600 uppercase">
              Total: <span className="font-bold text-gray-900">{filteredIngredients.length}</span> items
            </div>
          </div>
        )}

        {active === 'beverage' && (
          <div>
            <h2 className="text-xl font-bold mb-4 uppercase">Beverages from Sommelier Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-gray-900">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeverages.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500 uppercase">
                        No beverages found. Add beverages in Sommelier Management.
                      </td>
                    </tr>
                  ) : (
                    filteredBeverages.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.brand}</td>
                        <td className="px-4 py-3 text-sm">{item.category}</td>
                        <td className="px-4 py-3 text-sm">{item.type}</td>
                        <td className="px-4 py-3 text-sm">{item.size}</td>
                        <td className="px-4 py-3 text-sm">{item.vendor}</td>
                        <td className="px-4 py-3 text-sm">${item.cost?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm">${item.price?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm">{item.quantity || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600 uppercase">
              Total: <span className="font-bold text-gray-900">{filteredBeverages.length}</span> items
            </div>
          </div>
        )}

        {active === 'material' && (
          <div>
            <h2 className="text-xl font-bold mb-4 uppercase">Materials</h2>
            <div className="p-8 text-center border-2 border-gray-900 rounded bg-gray-50">
              <p className="text-gray-500 uppercase">Material inventory coming soon.</p>
              <p className="text-sm text-gray-400 mt-2">This section will display materials and supplies.</p>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}