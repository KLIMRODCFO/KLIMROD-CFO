'use client'

import { SalesRow } from '@/app/lib/types'

interface FeeDistributionProps {
  sales: SalesRow[]
  feeAmount: number
  distributionMethod: 'percentage' | 'equal'
  feeLabel: string
}

export default function FeeDistribution({ sales, feeAmount, distributionMethod, feeLabel }: FeeDistributionProps) {
  const validFeeAmount = feeAmount || 0
  const totalPoints = sales.reduce((sum, s) => sum + (s.points || 0), 0)
  
  const distribution = sales.map(sale => {
    const percentage = distributionMethod === 'percentage' 
      ? totalPoints > 0 ? (sale.points || 0) / totalPoints : 0
      : 1 / sales.length
    const amount = validFeeAmount * percentage
    return {
      employee: sale.employee,
      position: sale.position,
      amount: amount,
      points: sale.points || 0
    }
  }).filter(d => d.amount > 0)

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
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {distribution.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-center font-medium text-gray-900 uppercase">
                  {row.employee}
                </td>
                <td className="px-4 py-2 text-center text-gray-700 uppercase">
                  {row.position}
                </td>
                <td className="px-4 py-2 text-center text-gray-900 font-bold">
                  ${row.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <td colSpan={2} className="px-4 py-2 text-center uppercase">
                TOTAL {feeLabel}
              </td>
              <td className="px-4 py-2 text-center text-gray-900 font-bold">
                ${validFeeAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
