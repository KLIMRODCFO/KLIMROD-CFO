import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase Config:', {
  url: supabaseUrl ? '✅ SET' : '❌ MISSING',
  key: supabaseKey ? '✅ SET' : '❌ MISSING',
  urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined'
})

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE CREDENTIALS MISSING!')
  console.error('Make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Ingredient {
  id: string
  name: string
  category: string
  unit: string
  cost: number
  vendor1?: string
  vendor2?: string
  vendor3?: string
  restaurant_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  name: string
  category: string
  cost: number
  selling_price: number
  prep_time: number
  cook_time: number
  ingredients: { name: string; quantity: string; unit: string; cost?: number }[]
  instructions?: string
  active: boolean
  restaurant_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  date: string
  day: string
  year: number
  event_name: string
  shift: string
  manager: string
  restaurant_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface SalesReport {
  id: string
  event_id: string
  employee: string
  position: string
  net_sales: number
  cash_sales: number
  cc_sales: number
  cc_gratuity: number
  cash_gratuity: number
  points: number
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  hourly_labor_rate: number
  default_restaurant: string
  created_at: string
  updated_at: string
}
