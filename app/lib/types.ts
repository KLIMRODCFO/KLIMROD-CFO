// Event Types
export type Shift = 'LUNCH' | 'BRUNCH' | 'DINNER' | 'NIGHT'
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface Event {
  id?: string
  date: string // YYYY-MM-DD
  day: DayOfWeek
  year: number
  eventName: string // EVENT 1, EVENT 2, etc
  shift: Shift
  manager: string
  created_at?: string
  updated_at?: string
}

// Sales Report Types
export interface SalesRow {
  id?: string
  event_id?: string
  employee: string
  position: string
  netSales: number
  cashSales: number
  ccSales: number
  ccGratuity: number
  cashGratuity: number
  points: number
  created_at?: string
  updated_at?: string
}

// Totals calculation
export interface SalesTotals {
  totalNetSales: number
  totalCashSales: number
  totalCcSales: number
  totalCcGratuity: number
  totalCashGratuity: number
  totalPoints: number
  totalGratuity: number
}

// Expense Types
export interface ExpenseRow {
  id?: string
  event_id?: string
  expenseName: string
  amount: number
  paymentMethod: 'CHECK' | 'CASH' | ''
  paidBy: 'BUSINESS' | 'EMPLOYEE' | ''
  employeeName: string
  refunded: boolean
  created_at?: string
  updated_at?: string
}

export interface ExpenseTotals {
  totalExpenses: number
  totalCheck: number
  totalCash: number
  totalBusiness: number
  totalEmployee: number
  totalRefunded: number
}
