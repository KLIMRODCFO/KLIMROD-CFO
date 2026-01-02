'use client'

import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { useState, useEffect } from 'react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'APPETIZERS' | 'ENTREES' | 'SIDES' | 'DESSERTS' | 'BEVERAGES' | 'COCKTAILS' | 'WINE' | 'BEER' | 'OTHER'
  availability: boolean
  createdAt: string
  updatedAt: string
}

type MenuTab = 'APPETIZERS' | 'ENTREES' | 'SIDES' | 'DESSERTS' | 'BEVERAGES' | 'COCKTAILS' | 'WINE' | 'BEER' | 'OTHER'

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>('ENTREES')
  const [restaurantName, setRestaurantName] = useState<string>('')
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')
  const [items, setItems] = useState<MenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    availability: true
  })

  useEffect(() => {
    const updateData = () => {
      const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'
      setActiveRestaurantId(restaurantId)
      
      const restaurant = require('@/app/lib/restaurants').restaurants.find((r: any) => r.id === restaurantId)
      if (restaurant) {
        setRestaurantName(restaurant.name)
      }

      const stored = localStorage.getItem(`menu_items_${restaurantId}`)
      if (stored) setItems(JSON.parse(stored))
    }

    updateData()
    window.addEventListener('restaurant-changed', updateData)
    
    return () => {
      window.removeEventListener('restaurant-changed', updateData)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || parseFloat(form.price) <= 0) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const newItem: MenuItem = {
      id: 'ITEM' + Date.now().toString(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: activeTab,
      availability: form.availability,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updated = [...items, newItem]
    setItems(updated)
    localStorage.setItem(`menu_items_${activeRestaurantId}`, JSON.stringify(updated))
    setForm({ name: '', description: '', price: '', availability: true })
    alert('Item agregado al menú!')
  }

  const deleteItem = (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este item?')) return
    const updated = items.filter(item => item.id !== id)
    setItems(updated)
    localStorage.setItem(`menu_items_${activeRestaurantId}`, JSON.stringify(updated))
  }

  const toggleAvailability = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, availability: !item.availability } : item
    )
    setItems(updated)
    localStorage.setItem(`menu_items_${activeRestaurantId}`, JSON.stringify(updated))
  }

  const getTabItems = () => {
    return items
      .filter(item => item.category === activeTab)
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }

  const tabs: { id: MenuTab; label: string }[] = [
    { id: 'APPETIZERS', label: 'APPETIZERS' },
    { id: 'ENTREES', label: 'ENTREES' },
    { id: 'SIDES', label: 'SIDES' },
    { id: 'DESSERTS', label: 'DESSERTS' },
    { id: 'BEVERAGES', label: 'BEVERAGES' },
    { id: 'COCKTAILS', label: 'COCKTAILS' },
    { id: 'WINE', label: 'WINE' },
    { id: 'BEER', label: 'BEER' },
    { id: 'OTHER', label: 'OTHER' }
  ]

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-black mb-2">MENU</h1>
        {restaurantName && (
          <p className="text-lg font-semibold text-gray-600 mb-6">{restaurantName}</p>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="SEARCH MENU ITEMS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-900 rounded uppercase text-sm font-semibold"
          />
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 border-2 font-bold transition rounded text-xs ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add New Item Form */}
        <div className="mb-6 border-2 border-gray-900 rounded overflow-hidden">
          <div className="bg-gray-900 text-white px-6 py-3">
            <h3 className="text-lg font-bold uppercase">Add New Item</h3>
          </div>
          <form onSubmit={handleAddItem} className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-2 uppercase text-gray-700">Item Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-900 px-3 py-2 rounded text-sm uppercase font-semibold"
                  placeholder="ITEM NAME"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-gray-700">Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-900 px-3 py-2 rounded text-sm font-semibold"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="availability"
                    type="checkbox"
                    checked={form.availability}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-gray-900"
                  />
                  <span className="text-sm font-bold uppercase text-gray-700">Available</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold mb-2 uppercase text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-900 px-3 py-2 rounded text-sm font-semibold"
                placeholder="ITEM DESCRIPTION (OPTIONAL)"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setForm({ name: '', description: '', price: '', availability: true })}
                className="px-6 py-2 border-2 border-gray-900 font-bold rounded hover:bg-gray-100 uppercase text-sm"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-800 uppercase text-sm"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>

        {/* Menu Items Table */}
        <div className="border-2 border-gray-900 rounded overflow-hidden">
          <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold uppercase">{activeTab} Menu</h3>
            <span className="text-sm font-bold">Total: {getTabItems().length}</span>
          </div>

          {getTabItems().length === 0 ? (
            <div className="p-8 text-center bg-white">
              <p className="text-gray-500 uppercase font-semibold">No items in this category yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-white border-t-2 border-gray-900">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Item Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getTabItems().map(item => (
                    <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold uppercase">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.description || '-'}</td>
                      <td className="px-4 py-3 text-sm font-bold">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        {item.availability ? (
                          <span className="px-2 py-1 bg-green-100 text-green-900 rounded text-xs font-bold uppercase">Available</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-900 rounded text-xs font-bold uppercase">Unavailable</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleAvailability(item.id)}
                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 uppercase font-bold"
                          >
                            Toggle
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 uppercase font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
