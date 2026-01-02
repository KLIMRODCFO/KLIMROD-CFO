'use client'

import { SalesRow } from '@/app/lib/types'
import { generateTipReport } from '@/app/lib/tips'
import { useMemo } from 'react'

interface TipReportProps {
  sales: SalesRow[]
  distributionMethod: 'percentage' | 'equal'
  feeAmount?: number
  feeLabel?: string
}

export default function TipReport({ sales, distributionMethod, feeAmount, feeLabel }: TipReportProps) {
  const report = useMemo(() => {
    if (feeAmount && feeAmount > 0) {
      // Calculate fee distribution
      const totalPoints = sales.reduce((sum, s) => sum + (s.points || 0), 0)
      const distribution = sales.map(sale => {
        const percentage = distributionMethod === 'percentage' 
          ? totalPoints > 0 ? (sale.points || 0) / totalPoints : 0
          : 1 / sales.length
        const feeShare = feeAmount * percentage
        return {
          employee: sale.employee,
          ccGratuity: feeShare,
          cashGratuity: 0,
          tips: feeShare,
          points: sale.points || 0,
          percentage: percentage * 100
        }
      })
      return {
        distribution: distribution.filter(d => d.tips > 0),
        totals: {
          totalCcGratuity: feeAmount,
          totalCashGratuity: 0,
          totalGratuity: feeAmount,
          totalPoints: totalPoints
        }
      }
    }
    return generateTipReport(sales, distributionMethod)
  }, [sales, distributionMethod, feeAmount])

  const employeesWithTips = report.distribution.filter((t) => t.tips > 0)
  const displayLabel = feeLabel || 'Gratuity'

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Distribution Method */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600 font-medium">
          METHOD: <span className="text-blue-600 font-bold">
            {distributionMethod === 'percentage' ? 'BY POINTS' : 'EQUAL PARTS'}
          </span>
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {!feeAmount && (
          <>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">CARD GRATUITY</p>
              <p className="text-2xl font-bold text-green-600">
                ${report.totals.totalCcGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">CASH GRATUITY</p>
              <p className="text-2xl font-bold text-blue-600">
                ${report.totals.totalCashGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
            </div>
          </>
        )}
        <div className={`p-4 rounded-lg ${feeAmount ? 'bg-purple-50 col-span-3' : 'bg-purple-50'}`}>
          <p className="text-sm text-gray-600 font-medium">{feeLabel ? `TOTAL ${feeLabel.toUpperCase()}` : 'TOTAL GRATUITY'}</p>
          <p className="text-2xl font-bold text-purple-600">
            ${report.totals.totalGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
        </div>
      </div>

      {/* Distribution Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">EMPLOYEE</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">CC GRATUITY</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">CASH GRATUITY</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">TOTAL GRATUITY</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">POINTS</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">% OF TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {employeesWithTips.map((row, index) => {
              const percentage = report.totals.totalGratuity > 0 
                ? (row.tips / report.totals.totalGratuity) * 100 
                : 0
              const ccGratuity = row.ccGratuity || 0
              const cashGratuity = row.cashGratuity || 0
              const employeeData = sales.find(s => s.employee === row.employee)
              const points = employeeData?.points || 0
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900">{row.employee}</td>
                  <td className="px-4 py-2 text-right text-green-600 font-bold">
                    ${ccGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2 text-right text-blue-600 font-bold">
                    ${cashGratuity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2 text-right text-purple-600 font-bold">
                    ${row.tips.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2 text-right text-orange-600 font-semibold">
                    {points.toLocaleString('en-US')}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-600">
                    {percentage.toFixed(1)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {employeesWithTips.length === 0 && (
        <p className="text-center text-gray-500 py-8">NO SALES OR GRATUITY DATA YET</p>
      )}
    </div>
  )
}
