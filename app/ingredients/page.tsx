'use client'

import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { restaurants } from '@/app/lib/restaurants'

interface Ingredient {
  id: string
  name: string
  category: string
  unit: string
  vendor1: string
  vendor2: string
  vendor3: string
}

const CATEGORIES = [
  'PROTEINS',
  'VEGETABLES',
  'FRUITS',
  'DAIRY',
  'GRAINS',
  'OILS & FATS',
  'SPICES & HERBS',
  'BEVERAGES',
  'CONDIMENTS',
  'SEAFOOD',
  'BAKING',
  'OTHER'
]

const UNITS = [
  'KG',
  'G',
  'LB',
  'OZ',
  'L',
  'ML',
  'GALLON',
  'UNIT',
  'DOZEN',
  'BUNCH',
  'CAN',
  'BOTTLE',
  'BAG',
  'BOX'
]

const VENDORS = [
  'VENDOR A',
  'VENDOR B', 
  'VENDOR C',
  'VENDOR D',
  'VENDOR E',
  'LOCAL MARKET',
  'WHOLESALE SUPPLIER',
  'SPECIALTY PROVIDER',
  'DIRECT FARM',
  'OTHER'
]

export default function IngredientsPage() {
  const [activeRestaurant, setActiveRestaurant] = useState<string>('')
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('ALL')

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
    
    const key = `ingredients_${activeRestaurantId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      setIngredients(JSON.parse(stored))
    } else {
      setIngredients([])
    }
  }, [activeRestaurantId])

  const saveIngredients = (data: Ingredient[]) => {
    if (!activeRestaurantId) return
    const key = `ingredients_${activeRestaurantId}`
    localStorage.setItem(key, JSON.stringify(data))
    setIngredients(data)
  }

  const handleAdd = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      category: '',
      unit: '',
      vendor1: '',
      vendor2: '',
      vendor3: ''
    }
    saveIngredients([...ingredients, newIngredient])
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this ingredient?')) {
      saveIngredients(ingredients.filter(i => i.id !== id))
    }
  }

  const handleUpdate = (id: string, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value.toUpperCase() } : ing
    )
    saveIngredients(updated)
  }

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || ing.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AuthenticatedLayout>
      <div className="w-full px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">INGREDIENTS</h1>
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
            {/* Filters and Add Button */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">SEARCH</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ingredients..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">FILTER BY CATEGORY</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded"
                  >
                    <option value="ALL">ALL CATEGORIES</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAdd}
                    className="w-full px-6 py-2 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
                  >
                    + ADD INGREDIENT
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">NAME</th>
                      <th className="px-4 py-3 text-left font-semibold">CATEGORY</th>
                      <th className="px-4 py-3 text-left font-semibold">UNIT</th>
                      <th className="px-4 py-3 text-left font-semibold">VENDOR 1</th>
                      <th className="px-4 py-3 text-left font-semibold">VENDOR 2</th>
                      <th className="px-4 py-3 text-left font-semibold">VENDOR 3</th>
                      <th className="px-4 py-3 text-center font-semibold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIngredients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          No ingredients found. Click "ADD INGREDIENT" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredIngredients.map((ingredient) => (
                        <tr key={ingredient.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={ingredient.name}
                              onChange={(e) => handleUpdate(ingredient.id, 'name', e.target.value)}
                              placeholder="INGREDIENT NAME"
                              className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={ingredient.category}
                              onChange={(e) => handleUpdate(ingredient.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                              <option value="">SELECT</option>
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={ingredient.unit}
                              onChange={(e) => handleUpdate(ingredient.id, 'unit', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                              <option value="">SELECT</option>
                              {UNITS.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={ingredient.vendor1}
                              onChange={(e) => handleUpdate(ingredient.id, 'vendor1', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                              <option value="">SELECT</option>
                              {VENDORS.map(vendor => (
                                <option key={vendor} value={vendor}>{vendor}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={ingredient.vendor2}
                              onChange={(e) => handleUpdate(ingredient.id, 'vendor2', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                              <option value="">SELECT</option>
                              {VENDORS.map(vendor => (
                                <option key={vendor} value={vendor}>{vendor}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={ingredient.vendor3}
                              onChange={(e) => handleUpdate(ingredient.id, 'vendor3', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                              <option value="">SELECT</option>
                              {VENDORS.map(vendor => (
                                <option key={vendor} value={vendor}>{vendor}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDelete(ingredient.id)}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            >
                              DELETE
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {ingredients.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Total ingredients: <span className="font-semibold">{ingredients.length}</span></p>
                <p>Showing: <span className="font-semibold">{filteredIngredients.length}</span></p>
              </div>
            )}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
