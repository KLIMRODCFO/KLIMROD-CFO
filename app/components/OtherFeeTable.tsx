'use client'

interface OtherFeeRow {
  employee: string
  position: string
}

interface OtherFeeTableProps {
  rows: OtherFeeRow[]
  onUpdate: (index: number, field: 'employee' | 'position', value: string) => void
  onAddRow: () => void
  onDeleteRow: (index: number) => void
  totalFee: number
  employees: Array<{id: string, name: string, position: string}>
}

export default function OtherFeeTable({
  rows,
  onUpdate,
  onAddRow,
  onDeleteRow,
  totalFee,
  employees
}: OtherFeeTableProps) {
  const amountPerPerson = rows.length > 0 ? totalFee / rows.length : 0

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
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, index) => (
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
                    className="w-full min-w-[200px] px-3 py-2 border border-gray-300 rounded text-sm uppercase"
                  />
                </td>
                <td className="px-4 py-2 text-center text-gray-900 font-bold">
                  ${amountPerPerson.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
            <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <td colSpan={2} className="px-4 py-2">
                TOTAL OTHER FEE
              </td>
              <td className="px-4 py-2 text-center text-gray-900 font-bold">
                ${totalFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
          + Add Employee
        </button>
      </div>
    </div>
  )
}
