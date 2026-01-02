'use client'

import { SalesRow, SalesTotals } from '@/app/lib/types'

const NUMERIC_FIELDS: Array<keyof Pick<SalesRow, 'netSales' | 'cashSales' | 'ccSales' | 'ccGratuity' | 'cashGratuity' | 'points'>> = [
  'netSales',
  'cashSales',
  'ccSales',
  'ccGratuity',
  'cashGratuity',
  'points'
]

interface SalesTableProps {
  sales: SalesRow[]
  onUpdate: (index: number, field: keyof SalesRow, value: string | number) => void
  onAddRow: () => void
  onDeleteRow: (index: number) => void
  totals: SalesTotals
  employees: Array<{id: string, name: string, position: string}>
}

export default function SalesTable({
  sales,
  onUpdate,
  onAddRow,
  onDeleteRow,
  totals,
  employees
}: SalesTableProps) {

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Employee
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Net Sales
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Cash Sales
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                CC Sales
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                CC Gratuity
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Cash Gratuity
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Points
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">
                  <select
                    value={row.employee || ''}
                    onChange={(e) => onUpdate(index, 'employee', e.target.value)}
                    className="w-full min-w-[280px] px-3 py-2 border border-gray-300 rounded text-sm bg-white uppercase"
                  >
                    <option value="">SELECT EMPLOYEE</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.position || ''}
                    onChange={(e) => onUpdate(index, 'position', e.target.value)}
                    placeholder="Position"
                    className="w-full min-w-[200px] px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </td>
                {NUMERIC_FIELDS.map((field) => (
                  <td key={field} className="px-4 py-2">
                    <input
                      type="number"
                      value={row[field] || ''}
                      onChange={(e) => onUpdate(index, field, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      step="0.01"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onDeleteRow(index)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <td colSpan={2} className="px-4 py-2">
                TOTALS
              </td>
              <td className="px-4 py-2 text-right">${totals.totalNetSales.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right">${totals.totalCashSales.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right">${totals.totalCcSales.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right">${totals.totalCcGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right">${totals.totalCashGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right">{totals.totalPoints.toLocaleString('en-US')}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t border-gray-300">
        <button
          onClick={onAddRow}
          className="bg-gray-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-900 transition text-sm shadow-md"
        >
          + Add Row
        </button>
      </div>
    </div>
  )
}
