// Funciones de exportación a Excel eliminadas

import { Event, SalesRow, SalesTotals } from './types'



export function calculateTotals(sales: SalesRow[]): SalesTotals {
  return {
    totalNetSales: sales.reduce((sum, row) => sum + (row.netSales || 0), 0),
    totalCashSales: sales.reduce((sum, row) => sum + (row.cashSales || 0), 0),
    totalCcSales: sales.reduce((sum, row) => sum + (row.ccSales || 0), 0),
    totalCcGratuity: sales.reduce((sum, row) => sum + (row.ccGratuity || 0), 0),
    totalCashGratuity: sales.reduce((sum, row) => sum + (row.cashGratuity || 0), 0),
    totalPoints: sales.reduce((sum, row) => sum + (row.points || 0), 0),
    totalGratuity: sales.reduce((sum, row) => sum + (row.ccGratuity || 0) + (row.cashGratuity || 0), 0),
  }
}
