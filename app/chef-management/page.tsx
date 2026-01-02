'use client'

import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { useState, useEffect } from 'react'
import { restaurants } from '@/app/lib/restaurants'
import { supabase } from '@/app/lib/supabase'

type ChefTab = 'recipes' | 'ingredients' | 'production' | 'staff' | 'payroll' | 'reports'

export default function ChefManagementPage() {
  const [active, setActive] = useState<ChefTab>('recipes')
  const [restaurantName, setRestaurantName] = useState<string>('')

  useEffect(() => {
    const updateRestaurant = () => {
      const stored = localStorage.getItem('active_restaurant_id')
      if (stored) {
        const restaurant = restaurants.find(r => r.id === stored)
        if (restaurant) {
          setRestaurantName(restaurant.name)
        }
      }
    }
    updateRestaurant()
    window.addEventListener('restaurant-changed', updateRestaurant)
    return () => window.removeEventListener('restaurant-changed', updateRestaurant)
  }, [])

  const tabs = [
    { id: 'recipes', label: 'RECIPES' },
    { id: 'ingredients', label: 'INGREDIENTS' },
    { id: 'production', label: 'PRODUCTION ORDERS' },
    { id: 'staff', label: 'KITCHEN STAFF' },
    { id: 'payroll', label: 'KITCHEN PAYROLL' },
    { id: 'reports', label: 'REPORTS' }
  ]

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-black mb-2">CHEF MANAGEMENT</h1>
        {restaurantName && (
          <p className="text-lg font-semibold text-gray-600 mb-4">{restaurantName}</p>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id as ChefTab)}
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

        {/* Content Area */}
        <div>
          {active === 'recipes' && <RecipesSection />}
          {active === 'ingredients' && <IngredientsSection />}
          {active === 'production' && <ProductionOrdersSection />}
          {active === 'staff' && <KitchenStaffSection />}
          {active === 'payroll' && <KitchenPayrollSection />}
          {active === 'reports' && <ReportsSection />}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

function RecipesSection() {
  interface Recipe {
    id: string
    name: string
    category: string
    description?: string
    prepTime?: number // minutes (camelCase for old data)
    cookTime?: number
    servings?: number
    difficulty?: string
    prep_time?: number // snake_case from Supabase
    cook_time?: number
    selling_price?: number
    ingredients: { name: string; quantity: string; unit: string }[]
    instructions?: string[] | string // Can be array or string from Supabase
    cost: number
    sellingPrice?: number // camelCase for old data
    notes?: string
    active: boolean
    createdAt?: string
    updatedAt?: string
    created_at?: string
    updated_at?: string
    restaurant_id?: string
    user_id?: string
  }

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hourlyLaborRate, setHourlyLaborRate] = useState<number>(20)
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '',
    category: 'APPETIZERS',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'MEDIUM',
    cost: '',
    sellingPrice: '',
    notes: '',
    active: true
  })
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit: string }[]>([])
  const [instructions, setInstructions] = useState<string[]>([''])
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: 'KG' })
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null)
  const [editingIngredient, setEditingIngredient] = useState({ name: '', quantity: '', unit: '' })

  const CATEGORIES = ['APPETIZERS', 'ENTREES', 'SIDES', 'DESSERTS', 'SAUCES', 'OTHER']
  const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT']
  const UNITS = ['KG', 'G', 'LB', 'OZ', 'L', 'ML', 'UNIT', 'TBSP', 'TSP', 'CUP']

  useEffect(() => {
    const updateData = async () => {
      const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'
      setActiveRestaurantId(restaurantId)
      
      // Load recipes from Supabase
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name', { ascending: true })
      
      if (recipesError) {
        console.error('Error loading recipes:', recipesError)
      } else if (recipesData) {
        setRecipes(recipesData)
      }
      
      // Load ingredients from Supabase
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('restaurant_id', restaurantId)
      
      if (ingredientsError) {
        console.error('Error loading ingredients:', ingredientsError)
      } else if (ingredientsData) {
        setAvailableIngredients(ingredientsData)
      }
      
      // Load hourly rate (still from localStorage for now)
      const rateStored = localStorage.getItem(`hourly_labor_rate_${restaurantId}`)
      if (rateStored) setHourlyLaborRate(parseFloat(rateStored))
    }
    updateData()
    window.addEventListener('restaurant-changed', updateData)
    return () => window.removeEventListener('restaurant-changed', updateData)
  }, [])

  // Auto-calculate cost when ingredients or times change
  useEffect(() => {
    const calculateCost = () => {
      let ingredientsCost = 0
      
      // Calculate ingredients cost
      ingredients.forEach(ing => {
        const matchingIngredient = availableIngredients.find(
          ai => ai.name.toLowerCase() === ing.name.toLowerCase()
        )
        if (matchingIngredient && matchingIngredient.cost) {
          const quantity = parseFloat(ing.quantity) || 0
          ingredientsCost += quantity * matchingIngredient.cost
        }
      })
      
      // Calculate labor cost
      const totalMinutes = (parseInt(form.prepTime) || 0) + (parseInt(form.cookTime) || 0)
      const laborCost = (totalMinutes / 60) * hourlyLaborRate
      
      const totalCost = ingredientsCost + laborCost
      
      if (totalCost > 0) {
        setForm(prev => ({ ...prev, cost: totalCost.toFixed(2) }))
      }
    }
    
    calculateCost()
  }, [ingredients, form.prepTime, form.cookTime, hourlyLaborRate, availableIngredients])

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) return
    setIngredients([...ingredients, { ...newIngredient }])
    setNewIngredient({ name: '', quantity: '', unit: 'KG' })
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const editIngredient = (index: number) => {
    setEditingIngredientIndex(index)
    setEditingIngredient({ ...ingredients[index] })
  }

  const saveIngredientEdit = () => {
    if (editingIngredientIndex === null) return
    const updated = [...ingredients]
    updated[editingIngredientIndex] = { ...editingIngredient }
    setIngredients(updated)
    setEditingIngredientIndex(null)
    setEditingIngredient({ name: '', quantity: '', unit: '' })
  }

  const cancelIngredientEdit = () => {
    setEditingIngredientIndex(null)
    setEditingIngredient({ name: '', quantity: '', unit: '' })
  }

  const addInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || ingredients.length === 0 || instructions.filter(i => i.trim()).length === 0) {
      alert('Please complete all required fields')
      return
    }

    if (editingRecipeId) {
      // Update existing recipe
      const { error } = await supabase
        .from('recipes')
        .update({
          name: form.name,
          category: form.category,
          cost: parseFloat(form.cost) || 0,
          selling_price: parseFloat(form.sellingPrice) || 0,
          prep_time: parseInt(form.prepTime) || 0,
          cook_time: parseInt(form.cookTime) || 0,
          ingredients: ingredients,
          instructions: instructions.filter(i => i.trim()).join('\n'),
          active: form.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingRecipeId)
      
      if (error) {
        console.error('Error updating recipe:', error)
        alert('Error updating recipe')
      } else {
        // Update local state
        const updated = recipes.map(r => 
          r.id === editingRecipeId ? {
            ...r,
            name: form.name,
            category: form.category,
            cost: parseFloat(form.cost) || 0,
            selling_price: parseFloat(form.sellingPrice) || 0,
            prep_time: parseInt(form.prepTime) || 0,
            cook_time: parseInt(form.cookTime) || 0,
            ingredients: ingredients,
            instructions: instructions.filter(i => i.trim()).join('\n'),
            active: form.active,
            updated_at: new Date().toISOString()
          } : r
        )
        setRecipes(updated)
        setEditingRecipeId(null)
        alert('Recipe updated successfully!')
      }
    } else {
      // Add new recipe
      const { data, error } = await supabase
        .from('recipes')
        .insert([{
          name: form.name,
          category: form.category,
          cost: parseFloat(form.cost) || 0,
          selling_price: parseFloat(form.sellingPrice) || 0,
          prep_time: parseInt(form.prepTime) || 0,
          cook_time: parseInt(form.cookTime) || 0,
          ingredients: ingredients,
          instructions: instructions.filter(i => i.trim()).join('\n'),
          active: form.active,
          restaurant_id: activeRestaurantId,
          user_id: '00000000-0000-0000-0000-000000000000' // Temporary user_id
        }])
        .select()
      
      if (error) {
        console.error('Error adding recipe:', error)
        alert('Error adding recipe')
      } else if (data) {
        setRecipes([...recipes, data[0]])
        alert('Recipe added successfully!')
      }
    }
    
    // Reset form
    setForm({
      name: '', category: 'APPETIZERS', description: '', prepTime: '', cookTime: '',
      servings: '', difficulty: 'MEDIUM', cost: '', sellingPrice: '', notes: '', active: true
    })
    setIngredients([])
    setInstructions([''])
    setShowForm(false)
  }

  const deleteRecipe = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting recipe:', error)
      alert('Error deleting recipe')
    } else {
      setRecipes(recipes.filter(r => r.id !== id))
    }
  }

  const toggleActive = async (id: string) => {
    const recipe = recipes.find(r => r.id === id)
    if (!recipe) return
    
    const { error } = await supabase
      .from('recipes')
      .update({ active: !recipe.active, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) {
      console.error('Error toggling recipe:', error)
      alert('Error toggling recipe status')
    } else {
      setRecipes(recipes.map(r => r.id === id ? { ...r, active: !r.active } : r))
    }
  }

  const editRecipe = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id)
    
    // Parse instructions from string to array
    const instructionsArray = getRecipeInstructions(recipe)
    
    setForm({
      name: recipe.name,
      category: recipe.category,
      description: recipe.description || '',
      prepTime: getRecipeValue(recipe, 'prepTime').toString(),
      cookTime: getRecipeValue(recipe, 'cookTime').toString(),
      servings: (recipe.servings || 0).toString(),
      difficulty: recipe.difficulty || 'MEDIUM',
      cost: recipe.cost?.toString() || '',
      sellingPrice: getRecipeValue(recipe, 'sellingPrice').toString(),
      notes: recipe.notes || '',
      active: recipe.active
    })
    setIngredients([...recipe.ingredients])
    setInstructions(instructionsArray)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-900'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-900'
      case 'HARD': return 'bg-orange-100 text-orange-900'
      case 'EXPERT': return 'bg-red-100 text-red-900'
      default: return 'bg-gray-100 text-gray-900'
    }
  }

  // Helper to handle both camelCase and snake_case from Supabase
  const getRecipeValue = (recipe: Recipe, field: string): number => {
    if (field === 'prepTime') return recipe.prep_time || recipe.prepTime || 0
    if (field === 'cookTime') return recipe.cook_time || recipe.cookTime || 0
    if (field === 'sellingPrice') return recipe.selling_price || recipe.sellingPrice || 0
    return (recipe as any)[field] || 0
  }

  const getRecipeInstructions = (recipe: Recipe): string[] => {
    if (typeof recipe.instructions === 'string') {
      return recipe.instructions.split('\n').filter((i: string) => i.trim())
    }
    if (Array.isArray(recipe.instructions)) {
      return recipe.instructions
    }
    return []
  }

  return (
    <div>
      {/* Search and Add Button */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="SEARCH RECIPES..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded uppercase text-sm"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 uppercase text-sm"
        >
          {showForm ? '✕ CANCEL' : '+ ADD RECIPE'}
        </button>
      </div>

      {/* Add/Edit Recipe Form */}
      {showForm && (
        <div className="mb-6 border-2 border-gray-800 rounded overflow-hidden">
          <div className="px-6 py-3 bg-gray-900 text-white">
            <h3 className="text-lg font-bold uppercase">{editingRecipeId ? 'EDIT RECIPE' : 'ADD NEW RECIPE'}</h3>
          </div>
          <form onSubmit={handleAdd}>
            {/* Basic Info Table */}
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="w-1/4 px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">RECIPE NAME</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                      placeholder="RECIPE NAME"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">CATEGORY</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">DESCRIPTION</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={2}
                      placeholder="RECIPE DESCRIPTION"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Times and Servings Table */}
            <table className="w-full text-sm border-t-2 border-gray-800">
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="w-1/4 px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">PREP TIME (MIN)</td>
                  <td className="w-1/4 px-4 py-3 text-gray-900 bg-white border-r border-gray-800">
                    <input
                      type="number"
                      value={form.prepTime}
                      onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="w-1/4 px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">COOK TIME (MIN)</td>
                  <td className="w-1/4 px-4 py-3 text-gray-900 bg-white">
                    <input
                      type="number"
                      value={form.cookTime}
                      onChange={(e) => setForm({ ...form, cookTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">SERVINGS</td>
                  <td className="px-4 py-3 text-gray-900 bg-white border-r border-gray-800">
                    <input
                      type="number"
                      value={form.servings}
                      onChange={(e) => setForm({ ...form, servings: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">DIFFICULTY</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                    >
                      {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">RECIPE COST</td>
                  <td className="px-4 py-3 text-gray-900 bg-white border-r border-gray-800">
                    <input
                      type="number"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) => setForm({ ...form, cost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-yellow-50"
                      placeholder="0.00"
                      title="Auto-calculated from ingredients and labor. Can be manually overridden."
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">HOURLY RATE ($)</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <input
                      type="number"
                      value={hourlyLaborRate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value) || 20
                        setHourlyLaborRate(rate)
                        localStorage.setItem(`hourly_labor_rate_${activeRestaurantId}`, rate.toString())
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      step="0.50"
                      placeholder="20.00"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">SELLING PRICE</td>
                  <td className="px-4 py-3 text-gray-900 bg-white border-r border-gray-800">
                    <input
                      type="number"
                      step="0.01"
                      value={form.sellingPrice}
                      onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">RECIPE COST %</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <div className="px-3 py-2 font-bold text-right">
                      {(() => {
                        const cost = parseFloat(form.cost) || 0
                        const selling = parseFloat(form.sellingPrice) || 0
                        if (cost === 0 || selling === 0) return '-'
                        const costPercent = (cost / selling * 100).toFixed(1)
                        return `${costPercent}%`
                      })()}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">FOOD COST %</td>
                  <td className="px-4 py-3 text-gray-900 bg-white border-r border-gray-800">
                    <div className="px-3 py-2 font-bold text-right">
                      {(() => {
                        let ingredientsCost = 0
                        ingredients.forEach(ing => {
                          const matchingIng = availableIngredients.find(
                            ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                          )
                          if (matchingIng && matchingIng.cost) {
                            ingredientsCost += parseFloat(ing.quantity) * matchingIng.cost
                          }
                        })
                        const selling = parseFloat(form.sellingPrice) || 0
                        if (ingredientsCost === 0 || selling === 0) return '-'
                        return `${(ingredientsCost / selling * 100).toFixed(1)}%`
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">LABOR COST %</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <div className="px-3 py-2 font-bold text-right">
                      {(() => {
                        const totalMinutes = (parseInt(form.prepTime) || 0) + (parseInt(form.cookTime) || 0)
                        const laborCost = (totalMinutes / 60) * hourlyLaborRate
                        const selling = parseFloat(form.sellingPrice) || 0
                        if (laborCost === 0 || selling === 0) return '-'
                        return `${(laborCost / selling * 100).toFixed(1)}%`
                      })()}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Ingredients Section */}
            <div className="p-6 bg-gray-50 border-t-2 border-gray-800">
              <h4 className="text-sm font-bold mb-3 uppercase text-gray-900">INGREDIENTS</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                <div>
                  <input
                    list="ingredients-list"
                    value={newIngredient.name}
                    onChange={(e) => {
                      const value = e.target.value
                      setNewIngredient({ ...newIngredient, name: value })
                      // Auto-complete unit from ingredients directory
                      const matchingIng = availableIngredients.find(
                        ai => ai.name.toLowerCase() === value.toLowerCase()
                      )
                      if (matchingIng) {
                        setNewIngredient(prev => ({ ...prev, name: value, unit: matchingIng.unit }))
                      }
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded uppercase"
                    placeholder="INGREDIENT NAME"
                  />
                  <datalist id="ingredients-list">
                    {availableIngredients.map((ing) => (
                      <option key={ing.id} value={ing.name}>
                        {ing.name} - ${ing.cost?.toFixed(2)}/{ing.unit}
                      </option>
                    ))}
                  </datalist>
                </div>
                <input
                  type="number"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded"
                  placeholder="QUANTITY"
                  step="0.01"
                />
                <input
                  value={newIngredient.unit}
                  readOnly
                  className="border border-gray-300 px-3 py-2 rounded uppercase bg-gray-100"
                  placeholder="UNIT (AUTO)"
                  title="Unit is auto-filled from ingredients directory"
                />
                <div className="flex items-center justify-center border border-gray-300 px-3 py-2 rounded bg-yellow-50">
                  <span className="font-bold text-gray-900">
                    ${(() => {
                      const matchingIng = availableIngredients.find(
                        ai => ai.name.toLowerCase() === newIngredient.name.toLowerCase()
                      )
                      if (matchingIng && matchingIng.cost && newIngredient.quantity) {
                        return (parseFloat(newIngredient.quantity) * matchingIng.cost).toFixed(2)
                      }
                      return '0.00'
                    })()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 uppercase text-sm"
                >
                  + ADD
                </button>
              </div>
              {ingredients.length > 0 && (
                <div className="space-y-2">
                  {ingredients.map((ing, i) => {
                    const matchingIng = availableIngredients.find(
                      ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                    )
                    const ingredientCost = matchingIng && matchingIng.cost 
                      ? (parseFloat(ing.quantity) * matchingIng.cost).toFixed(2)
                      : '0.00'
                    
                    if (editingIngredientIndex === i) {
                      // Edit mode
                      const editMatchingIng = availableIngredients.find(
                        ai => ai.name.toLowerCase() === editingIngredient.name.toLowerCase()
                      )
                      const editCost = editMatchingIng && editMatchingIng.cost && editingIngredient.quantity
                        ? (parseFloat(editingIngredient.quantity) * editMatchingIng.cost).toFixed(2)
                        : '0.00'
                      
                      return (
                        <div key={i} className="grid grid-cols-5 gap-2 bg-blue-50 px-4 py-2 border-2 border-blue-300 rounded">
                          <input
                            list="ingredients-list"
                            value={editingIngredient.name}
                            onChange={(e) => {
                              const value = e.target.value
                              setEditingIngredient({ ...editingIngredient, name: value })
                              const matchingIng = availableIngredients.find(
                                ai => ai.name.toLowerCase() === value.toLowerCase()
                              )
                              if (matchingIng) {
                                setEditingIngredient(prev => ({ ...prev, name: value, unit: matchingIng.unit }))
                              }
                            }}
                            className="border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          />
                          <input
                            type="number"
                            value={editingIngredient.quantity}
                            onChange={(e) => setEditingIngredient({ ...editingIngredient, quantity: e.target.value })}
                            className="border border-gray-300 px-2 py-1 rounded text-sm"
                            step="0.01"
                          />
                          <input
                            value={editingIngredient.unit}
                            readOnly
                            className="border border-gray-300 px-2 py-1 rounded uppercase bg-gray-100 text-sm"
                          />
                          <div className="flex items-center justify-center bg-yellow-100 px-2 py-1 rounded">
                            <span className="font-bold text-sm">${editCost}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={saveIngredientEdit}
                              className="flex-1 bg-green-600 text-white font-bold text-xs uppercase hover:bg-green-700 rounded px-2 py-1"
                            >
                              SAVE
                            </button>
                            <button
                              type="button"
                              onClick={cancelIngredientEdit}
                              className="flex-1 bg-gray-600 text-white font-bold text-xs uppercase hover:bg-gray-700 rounded px-2 py-1"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      )
                    }
                    
                    // View mode
                    return (
                      <div key={i} className="flex items-center justify-between bg-white px-4 py-2 border border-gray-300 rounded">
                        <span className="text-sm font-semibold uppercase">{ing.quantity} {ing.unit} - {ing.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">${ingredientCost}</span>
                          <button
                            type="button"
                            onClick={() => editIngredient(i)}
                            className="text-blue-600 font-bold text-xs uppercase hover:text-blue-800"
                          >
                            ✎ EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => removeIngredient(i)}
                            className="text-red-600 font-bold text-xs uppercase hover:text-red-800"
                          >
                            ✕ REMOVE
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {ingredients.length > 0 && (
                <div className="mt-3 pt-3 border-t-2 border-gray-800 flex justify-between font-bold text-base bg-white px-4 py-2 rounded">
                  <span className="uppercase">TOTAL INGREDIENTS:</span>
                  <span>${(() => {
                    let total = 0
                    ingredients.forEach(ing => {
                      const matchingIng = availableIngredients.find(
                        ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                      )
                      if (matchingIng && matchingIng.cost) {
                        total += parseFloat(ing.quantity) * matchingIng.cost
                      }
                    })
                    return total.toFixed(2)
                  })()}</span>
                </div>
              )}
            </div>

            {/* Instructions Section */}
            <div className="p-6 bg-white border-t-2 border-gray-800">
              <h4 className="text-sm font-bold mb-3 uppercase text-gray-900">INSTRUCTIONS</h4>
              {instructions.map((inst, i) => (
                <div key={i} className="flex gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white font-bold rounded text-sm">
                    {i + 1}
                  </div>
                  <textarea
                    value={inst}
                    onChange={(e) => updateInstruction(i, e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded"
                    rows={2}
                    placeholder="INSTRUCTION STEP"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(i)}
                    className="px-3 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 uppercase text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className="px-4 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 uppercase text-sm"
              >
                + ADD STEP
              </button>
            </div>

            {/* Notes and Submit */}
            <table className="w-full text-sm border-t-2 border-gray-800">
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="w-1/4 px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">NOTES</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={2}
                      placeholder="ADDITIONAL NOTES"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white bg-gray-900 border-r border-gray-800">STATUS</td>
                  <td className="px-4 py-3 text-gray-900 bg-white">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold uppercase">ACTIVE RECIPE IN MENU</span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Submit Button */}
            <div className="p-6 bg-gray-50 border-t-2 border-gray-800">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800 uppercase text-lg"
              >
                {editingRecipeId ? 'SAVE CHANGES' : 'SAVE RECIPE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipes List */}
      <div className="border-2 border-gray-800 rounded overflow-hidden">
        <div className="px-6 py-3 bg-gray-900 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold uppercase">RECIPES LIBRARY</h3>
          <span className="text-sm font-bold">TOTAL: {filteredRecipes.length}</span>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="p-8 text-center bg-white">
            <p className="text-gray-500 uppercase font-semibold">NO RECIPES FOUND</p>
          </div>
        ) : (
          <div className="bg-white">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="border-b-2 border-gray-800 last:border-b-0">
                {/* Recipe Header */}
                <div className="px-6 py-3 bg-gray-100 flex justify-between items-center border-b border-gray-300">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold uppercase">{recipe.name}</h4>
                    {recipe.difficulty && (
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-900 text-white rounded text-xs font-bold uppercase">
                      {recipe.category}
                    </span>
                    {!recipe.active && (
                      <span className="px-2 py-1 bg-red-100 text-red-900 rounded text-xs font-bold uppercase">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editRecipe(recipe)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 uppercase font-bold"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => toggleActive(recipe.id)}
                      className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 uppercase font-bold"
                    >
                      {recipe.active ? 'DEACTIVATE' : 'ACTIVATE'}
                    </button>
                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 uppercase font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                </div>

                {/* Recipe Details in Table Format */}
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/4 px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">DESCRIPTION</td>
                      <td className="px-4 py-2 text-gray-900 bg-white">{recipe.description || '-'}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/6 px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">PREP TIME</td>
                      <td className="w-1/6 px-4 py-2 text-gray-900 bg-white border-r border-gray-300">{getRecipeValue(recipe, 'prepTime')} MIN</td>
                      <td className="w-1/6 px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">COOK TIME</td>
                      <td className="w-1/6 px-4 py-2 text-gray-900 bg-white border-r border-gray-300">{getRecipeValue(recipe, 'cookTime')} MIN</td>
                      <td className="w-1/6 px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">SERVINGS</td>
                      <td className="w-1/6 px-4 py-2 text-gray-900 bg-white">{recipe.servings || 0}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">RECIPE COST</td>
                      <td className="px-4 py-2 text-gray-900 bg-white font-bold text-right border-r border-gray-300">
                        ${recipe.cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">SELLING PRICE</td>
                      <td className="px-4 py-2 text-gray-900 bg-white font-bold text-right border-r border-gray-300">
                        ${getRecipeValue(recipe, 'sellingPrice').toFixed(2)}
                      </td>
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">MARGIN</td>
                      <td className="px-4 py-2 text-gray-900 bg-white font-bold text-right border-r border-gray-300">
                        ${(getRecipeValue(recipe, 'sellingPrice') - recipe.cost).toFixed(2)} ({((getRecipeValue(recipe, 'sellingPrice') - recipe.cost) / getRecipeValue(recipe, 'sellingPrice') * 100).toFixed(1)}%)
                      </td>
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">RECIPE COST %</td>
                      <td className="px-4 py-2 text-gray-900 bg-white font-bold text-right">
                        {(recipe.cost / getRecipeValue(recipe, 'sellingPrice') * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">FOOD COST %</td>
                      <td className="px-4 py-2 text-gray-900 bg-white font-bold text-right border-r border-gray-300">
                        {(() => {
                          let ingredientsCost = 0
                          recipe.ingredients.forEach(ing => {
                            const matchingIng = availableIngredients.find(
                              ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                            )
                            if (matchingIng && matchingIng.cost) {
                              ingredientsCost += parseFloat(ing.quantity) * matchingIng.cost
                            }
                          })
                          return (ingredientsCost / getRecipeValue(recipe, 'sellingPrice') * 100).toFixed(1)
                        })()}%
                      </td>
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">LABOR COST %</td>
                      <td className="px-4 py-2 text-gray-900 bg-white font-bold text-right border-r border-gray-300">
                        {(() => {
                          const totalMinutes = getRecipeValue(recipe, 'prepTime') + getRecipeValue(recipe, 'cookTime')
                          const laborCost = (totalMinutes / 60) * hourlyLaborRate
                          return (laborCost / getRecipeValue(recipe, 'sellingPrice') * 100).toFixed(1)
                        })()}%
                      </td>
                      <td colSpan={4}></td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">COST BREAKDOWN</td>
                      <td colSpan={7} className="px-4 py-2 text-gray-900 bg-yellow-50">
                        <div className="flex gap-6 text-xs font-semibold uppercase">
                          <span>
                            FOOD: $
                            {(() => {
                              let ingredientsCost = 0
                              recipe.ingredients.forEach(ing => {
                                const matchingIng = availableIngredients.find(
                                  ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                                )
                                if (matchingIng && matchingIng.cost) {
                                  ingredientsCost += parseFloat(ing.quantity) * matchingIng.cost
                                }
                              })
                              const foodPercent = recipe.cost > 0 ? (ingredientsCost / recipe.cost * 100).toFixed(1) : '0.0'
                              return `${ingredientsCost.toFixed(2)} (${foodPercent}%)`
                            })()}
                          </span>
                          <span>
                            LABOR: $
                            {(() => {
                              const totalMinutes = getRecipeValue(recipe, 'prepTime') + getRecipeValue(recipe, 'cookTime')
                              const laborCost = (totalMinutes / 60) * hourlyLaborRate
                              const laborPercent = recipe.cost > 0 ? (laborCost / recipe.cost * 100).toFixed(1) : '0.0'
                              return `${laborCost.toFixed(2)} (${laborPercent}%) - ${totalMinutes} MIN @ $${hourlyLaborRate}/HR`
                            })()}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800 align-top">INGREDIENTS</td>
                      <td colSpan={7} className="px-4 py-2 text-gray-900 bg-white">
                        <ul className="text-sm space-y-1">
                          {recipe.ingredients.map((ing, i) => {
                            const matchingIng = availableIngredients.find(
                              ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                            )
                            const ingredientCost = matchingIng && matchingIng.cost 
                              ? (parseFloat(ing.quantity) * matchingIng.cost).toFixed(2)
                              : '0.00'
                            return (
                              <li key={i} className="font-semibold flex justify-between">
                                <span>• {ing.quantity} {ing.unit} {ing.name}</span>
                                <span className="text-gray-600">${ingredientCost}</span>
                              </li>
                            )
                          })}
                        </ul>
                        <div className="mt-3 pt-3 border-t-2 border-gray-800 flex justify-between font-bold text-base">
                          <span>TOTAL INGREDIENTS:</span>
                          <span>${(() => {
                            let total = 0
                            recipe.ingredients.forEach(ing => {
                              const matchingIng = availableIngredients.find(
                                ai => ai.name.toLowerCase() === ing.name.toLowerCase()
                              )
                              if (matchingIng && matchingIng.cost) {
                                total += parseFloat(ing.quantity) * matchingIng.cost
                              }
                            })
                            return total.toFixed(2)
                          })()}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800 align-top">INSTRUCTIONS</td>
                      <td colSpan={7} className="px-4 py-2 text-gray-900 bg-white">
                        <ol className="text-sm space-y-2">
                          {getRecipeInstructions(recipe).map((inst: string, i: number) => (
                            <li key={i} className="font-semibold">
                              <span className="font-bold text-gray-900">{i + 1}.</span> {inst}
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                    {recipe.notes && (
                      <tr>
                        <td className="px-4 py-2 font-semibold text-white bg-gray-900 border-r border-gray-800">NOTES</td>
                        <td colSpan={7} className="px-4 py-2 text-gray-900 bg-yellow-50 font-semibold">
                          {recipe.notes}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function IngredientsSection() {
  interface Ingredient {
    id: string
    name: string
    category: string
    unit: string
    cost: number
    vendor1: string
    vendor2: string
    vendor3: string
  }

  const CATEGORIES = [
    'PROTEINS', 'VEGETABLES', 'FRUITS', 'DAIRY', 'GRAINS', 'OILS & FATS',
    'SPICES & HERBS', 'BEVERAGES', 'CONDIMENTS', 'SEAFOOD', 'BAKING', 'OTHER'
  ]

  const UNITS = [
    'KG', 'G', 'LB', 'OZ', 'L', 'ML', 'GALLON', 'UNIT', 'DOZEN', 'BUNCH', 'CAN', 'BOTTLE', 'BAG', 'BOX'
  ]

  const VENDORS = [
    'VENDOR A', 'VENDOR B', 'VENDOR C', 'VENDOR D', 'VENDOR E',
    'VENDOR F', 'VENDOR G', 'VENDOR H', 'VENDOR I', 'VENDOR J'
  ]

  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', category: '', unit: '', cost: '', vendor1: '', vendor2: '', vendor3: ''
  })
  const [editForm, setEditForm] = useState<Ingredient | null>(null)
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')

  // Load ingredients from Supabase
  useEffect(() => {
    const loadIngredients = async () => {
      const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'
      setActiveRestaurantId(restaurantId)
      
      console.log('🔄 Loading ingredients from Supabase for restaurant:', restaurantId)
      
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name', { ascending: true })
      
      console.log('📦 Supabase load response:', { data, error, count: data?.length })
      
      if (error) {
        console.error('❌ Error loading ingredients:', error)
        alert(`Error loading ingredients: ${error.message}`)
      } else if (data) {
        console.log('✅ Ingredients loaded:', data.length)
        setIngredients(data)
      }
    }
    loadIngredients()
  }, [])

  const handleAdd = async () => {
    if (!form.name || !form.category || !form.unit || !form.cost) return
    
    console.log('Attempting to add ingredient:', {
      name: form.name,
      category: form.category,
      unit: form.unit,
      cost: parseFloat(form.cost),
      restaurant_id: activeRestaurantId
    })
    
    const { data, error } = await supabase
      .from('ingredients')
      .insert([{
        name: form.name,
        category: form.category,
        unit: form.unit,
        cost: parseFloat(form.cost) || 0,
        vendor1: form.vendor1 || null,
        vendor2: form.vendor2 || null,
        vendor3: form.vendor3 || null,
        restaurant_id: activeRestaurantId,
        user_id: '00000000-0000-0000-0000-000000000000' // Temporary user_id
      }])
      .select()
    
    console.log('Supabase response:', { data, error })
    
    if (error) {
      console.error('Error adding ingredient:', error)
      alert(`Error adding ingredient: ${error.message || JSON.stringify(error)}`)
    } else if (data) {
      console.log('Ingredient added successfully:', data[0])
      setIngredients([...ingredients, data[0]])
      setForm({ name: '', category: '', unit: '', cost: '', vendor1: '', vendor2: '', vendor3: '' })
      setShowForm(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Delete this ingredient?')
    if (!confirmed) return
    
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting ingredient:', error)
      alert('Error deleting ingredient')
    } else {
      setIngredients(ingredients.filter(i => i.id !== id))
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id)
    setEditForm({ ...ingredient })
  }

  const handleSaveEdit = async () => {
    if (!editForm || !editForm.name || !editForm.category || !editForm.unit) return
    
    const { error } = await supabase
      .from('ingredients')
      .update({
        name: editForm.name,
        category: editForm.category,
        unit: editForm.unit,
        cost: parseFloat(editForm.cost.toString()) || 0,
        vendor1: editForm.vendor1 || null,
        vendor2: editForm.vendor2 || null,
        vendor3: editForm.vendor3 || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingId)
    
    if (error) {
      console.error('Error updating ingredient:', error)
      alert('Error updating ingredient')
    } else {
      const updated = ingredients.map(i => 
        i.id === editingId ? { ...editForm, cost: parseFloat(editForm.cost.toString()) || 0 } : i
      )
      setIngredients(updated)
      setEditingId(null)
      setEditForm(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const filteredIngredients = ingredients.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || i.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 uppercase">Ingredients Directory</h2>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="SEARCH INGREDIENT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-2 border-gray-900 px-4 py-2 rounded uppercase"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border-2 border-gray-900 px-4 py-2 rounded uppercase font-semibold"
        >
          <option value="ALL">ALL CATEGORIES</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-gray-900 text-white rounded font-semibold uppercase hover:bg-gray-800"
        >
          {showForm ? 'CANCEL' : '+ ADD NEW INGREDIENT'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-900 rounded p-4 mb-4">
          <h3 className="font-bold mb-3 uppercase">New Ingredient</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="INGREDIENT NAME"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              <option value="">SELECT CATEGORY</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              <option value="">SELECT UNIT</option>
              {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
            <input
              type="number"
              placeholder="COST PER UNIT ($)"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              step="0.01"
            />
            <select
              value={form.vendor1}
              onChange={(e) => setForm({ ...form, vendor1: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              <option value="">VENDOR 1 (OPTIONAL)</option>
              {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select
              value={form.vendor2}
              onChange={(e) => setForm({ ...form, vendor2: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              <option value="">VENDOR 2 (OPTIONAL)</option>
              {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 mt-3">
            <select
              value={form.vendor3}
              onChange={(e) => setForm({ ...form, vendor3: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              <option value="">VENDOR 3 (OPTIONAL)</option>
              {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-gray-900 text-white py-2 rounded font-semibold uppercase hover:bg-gray-800"
          >
            SAVE INGREDIENT
          </button>
        </div>
      )}

      {/* Ingredients Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-gray-900">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Unit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Cost per Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Vendor 1</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Vendor 2</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Vendor 3</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 uppercase">
                    No ingredients found. Add your first ingredient.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="border-b border-gray-200 hover:bg-gray-50">
                    {editingId === ingredient.id && editForm ? (
                      <>
                        <td className="px-4 py-3 text-sm">
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value.toUpperCase() })}
                            className="w-full border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={editForm.unit}
                            onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                            className="w-full border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          >
                            {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.cost}
                            onChange={(e) => setEditForm({ ...editForm, cost: parseFloat(e.target.value) || 0 })}
                            className="w-full border border-gray-300 px-2 py-1 rounded text-right text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={editForm.vendor1}
                            onChange={(e) => setEditForm({ ...editForm, vendor1: e.target.value })}
                            className="w-full border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          >
                            <option value="">-</option>
                            {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={editForm.vendor2}
                            onChange={(e) => setEditForm({ ...editForm, vendor2: e.target.value })}
                            className="w-full border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          >
                            <option value="">-</option>
                            {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={editForm.vendor3}
                            onChange={(e) => setEditForm({ ...editForm, vendor3: e.target.value })}
                            className="w-full border border-gray-300 px-2 py-1 rounded uppercase text-sm"
                          >
                            <option value="">-</option>
                            {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 uppercase"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 uppercase"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm font-semibold">{ingredient.name}</td>
                        <td className="px-4 py-3 text-sm">{ingredient.category}</td>
                        <td className="px-4 py-3 text-sm">{ingredient.unit}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">${ingredient.cost?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3 text-sm">{ingredient.vendor1 || '-'}</td>
                        <td className="px-4 py-3 text-sm">{ingredient.vendor2 || '-'}</td>
                        <td className="px-4 py-3 text-sm">{ingredient.vendor3 || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(ingredient)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 uppercase"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(ingredient.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 uppercase"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600 uppercase">
        Total: <span className="font-bold text-gray-900">{filteredIngredients.length}</span> ingredients
        {filterCategory !== 'ALL' && ` in ${filterCategory}`}
      </div>
    </div>
  )
}

function ProductionOrdersSection() {
  interface ProductionOrder {
    id: string
    date: string
    recipe: string
    quantity: number
    unit: string
    status: 'PENDING' | 'IN PROGRESS' | 'COMPLETED' | 'DELAYED'
    assignedTo: string
    notes: string
    createdAt: string
  }

  const STATUS_OPTIONS: Array<'PENDING' | 'IN PROGRESS' | 'COMPLETED' | 'DELAYED'> = ['PENDING', 'IN PROGRESS', 'COMPLETED', 'DELAYED']
  const UNIT_OPTIONS = ['KG', 'G', 'LB', 'OZ', 'L', 'ML', 'UNIT', 'DOZEN', 'BATCH', 'PORTION']

  const [orders, setOrders] = useState<ProductionOrder[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    date: '', recipe: '', quantity: 0, unit: '', status: 'PENDING' as ProductionOrder['status'], assignedTo: '', notes: ''
  })
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('')

  useEffect(() => {
    const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'
    setActiveRestaurantId(restaurantId)
    const stored = localStorage.getItem(`production_orders_${restaurantId}`)
    if (stored) setOrders(JSON.parse(stored))
  }, [])

  const handleAdd = () => {
    if (!form.date || !form.recipe || !form.quantity || !form.unit) return
    const newOrder: ProductionOrder = { 
      id: Date.now().toString(), 
      ...form,
      createdAt: new Date().toISOString()
    }
    const updated = [...orders, newOrder]
    setOrders(updated)
    localStorage.setItem(`production_orders_${activeRestaurantId}`, JSON.stringify(updated))
    setForm({ date: '', recipe: '', quantity: 0, unit: '', status: 'PENDING', assignedTo: '', notes: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = orders.filter(o => o.id !== id)
    setOrders(updated)
    localStorage.setItem(`production_orders_${activeRestaurantId}`, JSON.stringify(updated))
  }

  const handleStatusChange = (id: string, newStatus: ProductionOrder['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o)
    setOrders(updated)
    localStorage.setItem(`production_orders_${activeRestaurantId}`, JSON.stringify(updated))
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.recipe.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    pending: orders.filter(o => o.status === 'PENDING').length,
    inProgress: orders.filter(o => o.status === 'IN PROGRESS').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    delayed: orders.filter(o => o.status === 'DELAYED').length
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 uppercase">Production Orders</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-4 border-2 border-gray-900 rounded bg-white">
          <p className="text-xs font-semibold uppercase text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="p-4 border-2 border-gray-900 rounded bg-white">
          <p className="text-xs font-semibold uppercase text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="p-4 border-2 border-gray-900 rounded bg-white">
          <p className="text-xs font-semibold uppercase text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="p-4 border-2 border-gray-900 rounded bg-white">
          <p className="text-xs font-semibold uppercase text-gray-600">Delayed</p>
          <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="SEARCH RECIPE OR STAFF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-2 border-gray-900 px-4 py-2 rounded uppercase"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border-2 border-gray-900 px-4 py-2 rounded uppercase font-semibold"
        >
          <option value="ALL">ALL STATUS</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-gray-900 text-white rounded font-semibold uppercase hover:bg-gray-800"
        >
          {showForm ? 'CANCEL' : '+ NEW ORDER'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-900 rounded p-4 mb-4">
          <h3 className="font-bold mb-3 uppercase">New Production Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            />
            <input
              placeholder="INGREDIENT"
              value={form.recipe}
              onChange={(e) => setForm({ ...form, recipe: e.target.value.toUpperCase() })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            />
            <input
              type="number"
              placeholder="QUANTITY"
              value={form.quantity || ''}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            />
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              <option value="">SELECT UNIT</option>
              {UNIT_OPTIONS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
            <input
              placeholder="ASSIGNED TO"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value.toUpperCase() })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProductionOrder['status'] })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase"
            >
              {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <textarea
              placeholder="NOTES (OPTIONAL)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value.toUpperCase() })}
              className="border-2 border-gray-900 px-3 py-2 rounded uppercase md:col-span-2"
              rows={2}
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-gray-900 text-white py-2 rounded font-semibold uppercase hover:bg-gray-800"
          >
            CREATE ORDER
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-gray-900">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Recipe</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Notes</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 uppercase">
                  No production orders found. Create your first order.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{order.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{order.recipe}</td>
                  <td className="px-4 py-3 text-sm">{order.quantity} {order.unit}</td>
                  <td className="px-4 py-3 text-sm">{order.assignedTo || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as ProductionOrder['status'])}
                      className={`px-2 py-1 rounded text-xs font-semibold uppercase border-2 ${
                        order.status === 'COMPLETED' ? 'bg-green-100 border-green-600 text-green-700' :
                        order.status === 'IN PROGRESS' ? 'bg-yellow-100 border-yellow-600 text-yellow-700' :
                        order.status === 'DELAYED' ? 'bg-red-100 border-red-600 text-red-700' :
                        'bg-gray-100 border-gray-600 text-gray-700'
                      }`}
                    >
                      {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{order.notes || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 uppercase"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600 uppercase">
        Total: <span className="font-bold text-gray-900">{filteredOrders.length}</span> orders
        {filterStatus !== 'ALL' && ` with status ${filterStatus}`}
      </div>
    </div>
  )
}

function KitchenStaffSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kitchen Staff</h2>
      <div className="p-6 bg-gray-50 rounded text-center">
        <p className="text-gray-600 mb-4">Gestión del personal de cocina</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border rounded bg-white">
            <p className="font-semibold">Total Staff</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <p className="font-semibold">Activos Hoy</p>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <p className="font-semibold">Ausentes</p>
            <p className="text-2xl font-bold text-red-600">0</p>
          </div>
        </div>
        <button className="mt-6 px-6 py-2 bg-blue-900 text-white rounded font-semibold">
          + Agregar Personal
        </button>
      </div>
    </div>
  )
}

function KitchenPayrollSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kitchen Payroll</h2>
      <div className="p-6 bg-gray-50 rounded text-center">
        <p className="text-gray-600 mb-4">Gestión de nómina del personal de cocina</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border rounded bg-white">
            <p className="font-semibold">Horas Totales</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <p className="font-semibold">Nómina Pendiente</p>
            <p className="text-2xl font-bold text-red-600">$0.00</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <p className="font-semibold">Nómina Pagada</p>
            <p className="text-2xl font-bold text-green-600">$0.00</p>
          </div>
        </div>
        <button className="mt-6 px-6 py-2 bg-blue-900 text-white rounded font-semibold">
          Procesar Nómina
        </button>
      </div>
    </div>
  )
}

function ReportsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <div className="p-6 bg-gray-50 rounded">
        <p className="text-gray-600 mb-6">Reportes y análisis del departamento de cocina</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-blue-900 rounded hover:bg-blue-50 transition text-left">
            <p className="font-semibold">Reporte de Producción</p>
            <p className="text-sm text-gray-600">Análisis de órdenes completadas</p>
          </button>
          <button className="p-4 border-2 border-blue-900 rounded hover:bg-blue-50 transition text-left">
            <p className="font-semibold">Reporte de Costos</p>
            <p className="text-sm text-gray-600">Análisis de ingredientes y costos</p>
          </button>
          <button className="p-4 border-2 border-blue-900 rounded hover:bg-blue-50 transition text-left">
            <p className="font-semibold">Reporte de Personal</p>
            <p className="text-sm text-gray-600">Análisis de horas y desempeño</p>
          </button>
          <button className="p-4 border-2 border-blue-900 rounded hover:bg-blue-50 transition text-left">
            <p className="font-semibold">Reporte de Eficiencia</p>
            <p className="text-sm text-gray-600">Métricas de productividad</p>
          </button>
        </div>
      </div>
    </div>
  )
}
