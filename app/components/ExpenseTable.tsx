'use client'

import { ExpenseRow, ExpenseTotals } from '@/app/lib/types'

interface ExpenseTableProps {
  expenses: ExpenseRow[]
  onUpdate: (index: number, field: keyof ExpenseRow, value: string | number | boolean) => void
  onAddRow: () => void
  onDeleteRow: (index: number) => void
  totals: ExpenseTotals
  employees: Array<{id: string, name: string, position: string}>
}

export default function ExpenseTable({
  expenses,
  onUpdate,
  onAddRow,
  onDeleteRow,
  totals,
  employees
}: ExpenseTableProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Expense Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Paid By
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Refunded
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={row.expenseName || ''}
                    onChange={(e) => onUpdate(index, 'expenseName', e.target.value)}
                    placeholder="Expense name"
                    className="w-full min-w-[200px] px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={row.amount || ''}
                    onChange={(e) => onUpdate(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.paymentMethod || ''}
                    onChange={(e) => onUpdate(index, 'paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                  >
                    <option value="">SELECT METHOD</option>
                    <option value="CHECK">CHECK</option>
                    <option value="CASH">CASH</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.paidBy || ''}
                    onChange={(e) => onUpdate(index, 'paidBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                  >
                    <option value="">SELECT</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.employeeName || ''}
                    onChange={(e) => onUpdate(index, 'employeeName', e.target.value)}
                    className={`w-full min-w-[280px] px-3 py-2 border border-gray-300 rounded text-sm uppercase ${row.paidBy !== 'EMPLOYEE' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    disabled={row.paidBy !== 'EMPLOYEE'}
                  >
                    <option value="">SELECT EMPLOYEE</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.refunded || false}
                    onChange={(e) => onUpdate(index, 'refunded', e.target.checked)}
                    disabled={row.paidBy !== 'EMPLOYEE'}
                    className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${row.paidBy !== 'EMPLOYEE' ? 'cursor-not-allowed opacity-50' : ''}`}
                  />
                </td>
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
            {/* Totals Row */}
            <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <td className="px-4 py-2">
                TOTALS
              </td>
              <td className="px-4 py-2 text-right">${totals.totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right text-sm">
                CHECK: ${totals.totalCheck.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br/>
                CASH: ${totals.totalCash.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
              <td className="px-4 py-2 text-right text-sm">
                BUSINESS: ${totals.totalBusiness.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br/>
                EMPLOYEE: ${totals.totalEmployee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-center">
                REFUNDED: ${totals.totalRefunded.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
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
          + Add Expense
        </button>
      </div>
    </div>
  )
}
