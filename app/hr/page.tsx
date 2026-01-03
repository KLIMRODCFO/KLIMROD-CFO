'use client'

import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTucciEmployeesForDirectory, getTucciEmployeesForSales } from '@/app/lib/tucciBrigade'
import { supabase } from '@/app/lib/supabase'

interface Employee {
  id: string
  name: string
  email: string
  position: string
}

interface TimecardEntry {
  id: string
  employeeId: string
  date: string
  shiftStart: string
  shiftEnd: string
  event: string
  hourlyRate: number
  totalHours: number
  totalEarnings: number
  notes: string
}

interface PayrollEntry {
  employeeId: string
  employeeName: string
  totalHours: number
  grossSalary: number
  taxesDeductions: number
  netSalary: number
  period: string
  status: 'pending' | 'approved' | 'processed'
}

interface CreditCardGratuity {
  id: string
  date: string
  employeeId: string
  employeeName: string
  event: string
  cardNetwork: 'visa' | 'mastercard' | 'amex' | 'discover'
  amount: number
  notes: string
}

interface DirectoryEmployee extends Employee {
  phone: string
  startDate: string
  status: 'active' | 'inactive'
}

type HRTab = 'application' | 'timecard' | 'payroll' | 'cc-report' | 'directory'

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<HRTab>('application')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [directoryEmployees, setDirectoryEmployees] = useState<DirectoryEmployee[]>([])
  const [timecards, setTimecards] = useState<TimecardEntry[]>([])
  const [payroll, setPayroll] = useState<PayrollEntry[]>([])
  const [ccGratuities, setCCGratuities] = useState<CreditCardGratuity[]>([])

  useEffect(() => {
    const loadData = async () => {
      const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'
      
      // Load directory employees from Supabase
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name', { ascending: true })
      
      if (empError) {
        console.error('Error loading employees:', empError)
      } else if (empData && empData.length > 0) {
        const mapped = empData.map((e: any) => ({
          id: e.id,
          name: e.name,
          email: e.email || '',
          phone: e.phone || '',
          position: e.position,
          startDate: e.start_date || '',
          status: e.status || 'active'
        }))
        setDirectoryEmployees(mapped)
        
        // Also use for simple employee list
        const simpleEmp = empData.map((e: any) => ({
          id: e.id,
          name: e.name,
          email: e.email || '',
          position: e.position
        }))
        setEmployees(simpleEmp)
      } else {
        // First time: initialize with TUCCI employees
        const tucciDir = getTucciEmployeesForDirectory()
        setDirectoryEmployees(tucciDir)
        setEmployees(getTucciEmployeesForSales())
        
        // Save to Supabase
        for (const emp of tucciDir) {
          await supabase.from('employees').insert([{
            name: emp.name,
            email: emp.email,
            phone: emp.phone || null,
            position: emp.position,
            start_date: emp.startDate,
            status: emp.status,
            restaurant_id: restaurantId,
            user_id: '00000000-0000-0000-0000-000000000000'
          }])
        }
      }

      // Load timecards (still localStorage)
      const tc = localStorage.getItem('timecards')
      if (tc) setTimecards(JSON.parse(tc))

      // Load payroll (still localStorage)
      const pr = localStorage.getItem('payroll')
      if (pr) setPayroll(JSON.parse(pr))

      // Load CC gratuities (still localStorage)
      const cc = localStorage.getItem('cc_gratuities')
      if (cc) setCCGratuities(JSON.parse(cc))
    }
    
    loadData()
  }, [])

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-black mb-6">HR MANAGEMENT</h1>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('application')}
            className={`px-4 py-2 border-2 font-semibold rounded ${
              activeTab === 'application'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-black border-black hover:bg-gray-100'
            }`}
          >
            📋 APPLICATION
          </button>
          <button
            onClick={() => setActiveTab('timecard')}
            className={`px-4 py-2 border-2 font-semibold rounded ${
              activeTab === 'timecard'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-black border-black hover:bg-gray-100'
            }`}
          >
            ⏰ TIMECARD
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 border-2 font-semibold rounded ${
              activeTab === 'payroll'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-black border-black hover:bg-gray-100'
            }`}
          >
            💳 PAYROLL
          </button>
          <button
            onClick={() => setActiveTab('cc-report')}
            className={`px-4 py-2 border-2 font-semibold rounded ${
              activeTab === 'cc-report'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-black border-black hover:bg-gray-100'
            }`}
          >
            🎫 CC GRATUITY
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 border-2 font-semibold rounded ${
              activeTab === 'directory'
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-black border-black hover:bg-gray-100'
            }`}
          >
            👥 DIRECTORY
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'application' && <ApplicationSection />}
        {activeTab === 'timecard' && <TimecardSection employees={employees} timecards={timecards} setTimecards={setTimecards} />}
        {activeTab === 'payroll' && <PayrollSection timecards={timecards} employees={employees} payroll={payroll} setPayroll={setPayroll} />}
        {activeTab === 'cc-report' && <CreditCardGratuitySection ccGratuities={ccGratuities} setCCGratuities={setCCGratuities} employees={employees} />}
        {activeTab === 'directory' && <EmployeeDirectorySection directoryEmployees={directoryEmployees} setDirectoryEmployees={setDirectoryEmployees} employees={employees} />}
      </div>
    </AuthenticatedLayout>
  )
}

function ApplicationSection() {
  return (
    <div className="bg-white border-2 border-black rounded p-6">
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">APPLICATION FOR EMPLOYMENT</h2>
      <Link href="/hr/application" className="px-6 py-3 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800 inline-block">
        ➕ NEW APPLICATION
      </Link>
    </div>
  )
}

function TimecardSection({ employees, timecards, setTimecards }: any) {
  const [form, setForm] = useState({
    employeeId: '',
    date: '',
    shiftStart: '',
    shiftEnd: '',
    event: '',
    hourlyRate: 0,
    notes: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'hourlyRate' ? parseFloat(value) : value }))
  }

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0
    const [startH, startM] = start.split(':').map(Number)
    const [endH, endM] = end.split(':').map(Number)
    const startMin = startH * 60 + startM
    const endMin = endH * 60 + endM
    return (endMin - startMin) / 60
  }

  const handleAddTimecard = () => {
    if (!form.employeeId || !form.date || !form.shiftStart || !form.shiftEnd || form.hourlyRate <= 0) {
      alert('Completa todos los campos requeridos')
      return
    }

    const hours = calculateHours(form.shiftStart, form.shiftEnd)
    const newEntry: TimecardEntry = {
      id: 'TC' + Date.now().toString(),
      employeeId: form.employeeId,
      date: form.date,
      shiftStart: form.shiftStart,
      shiftEnd: form.shiftEnd,
      event: form.event,
      hourlyRate: form.hourlyRate,
      totalHours: parseFloat(hours.toFixed(2)),
      totalEarnings: parseFloat((hours * form.hourlyRate).toFixed(2)),
      notes: form.notes
    }

    const updated = [...timecards, newEntry]
    setTimecards(updated)
    localStorage.setItem('timecards', JSON.stringify(updated))
    setForm({ employeeId: '', date: '', shiftStart: '', shiftEnd: '', event: '', hourlyRate: 0, notes: '' })
    alert('Timecard guardado!')
  }

  const deleteTimecard = (id: string) => {
    const updated = timecards.filter((tc: any) => tc.id !== id)
    setTimecards(updated)
    localStorage.setItem('timecards', JSON.stringify(updated))
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Form */}
        <div className="bg-white border-2 border-black rounded p-6">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">AGREGAR TURNO</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">EMPLEADO *</label>
              <select name="employeeId" value={form.employeeId} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded text-sm">
                <option value="">-- Seleccionar --</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">FECHA *</label>
              <input type="date" name="date" value={form.date} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">HORA INICIO *</label>
              <input type="time" name="shiftStart" value={form.shiftStart} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">HORA FIN *</label>
              <input type="time" name="shiftEnd" value={form.shiftEnd} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">EVENTO/TURNO</label>
              <input type="text" name="event" value={form.event} onChange={handleInputChange} className="w-full border px-3 py-2 rounded text-sm" placeholder="Ej: Evento VIP, Kitchen, etc" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">TARIFA HORARIA ($) *</label>
              <input type="number" name="hourlyRate" step="0.01" value={form.hourlyRate} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">NOTAS</label>
              <textarea name="notes" value={form.notes} onChange={handleInputChange} className="w-full border px-3 py-2 rounded text-sm" rows={2} />
            </div>
            <button onClick={handleAddTimecard} className="w-full px-4 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR TURNO</button>
          </div>
        </div>

        {/* Summary by Employee */}
        <div className="lg:col-span-2 bg-white border-2 border-black rounded p-6">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">RESUMEN POR EMPLEADO</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {employees.map((emp: any) => {
              const empTimecards = timecards.filter((tc: any) => tc.employeeId === emp.id)
              const totalHours = empTimecards.reduce((sum: number, tc: any) => sum + tc.totalHours, 0)
              const totalEarnings = empTimecards.reduce((sum: number, tc: any) => sum + tc.totalEarnings, 0)
              return empTimecards.length > 0 ? (
                <div key={emp.id} className="p-3 border rounded bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-black">{emp.name}</p>
                      <p className="text-xs text-gray-600">{emp.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-900">${totalEarnings.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">{totalHours.toFixed(1)}h</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 border-t pt-2">
                    {empTimecards.map((tc: any) => (
                      <div key={tc.id} className="flex justify-between mb-1">
                        <span>{tc.date} - {tc.shiftStart} a {tc.shiftEnd} {tc.event && `(${tc.event})`}</span>
                        <span>${tc.totalEarnings.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })}
          </div>
        </div>
      </div>

      {/* All Timecards Table */}
      <div className="bg-white border-2 border-black rounded p-6">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">TODOS LOS TURNOS</h2>
        {timecards.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No hay turnos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-2">EMPLEADO</th>
                  <th className="p-2">FECHA</th>
                  <th className="p-2">TURNO</th>
                  <th className="p-2">EVENTO</th>
                  <th className="p-2">HORAS</th>
                  <th className="p-2">TARIFA</th>
                  <th className="p-2">GANANCIA</th>
                  <th className="p-2">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {timecards.map((tc: any) => {
                  const emp = employees.find((e: any) => e.id === tc.employeeId)
                  return (
                    <tr key={tc.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-semibold">{emp?.name}</td>
                      <td className="p-2">{tc.date}</td>
                      <td className="p-2 text-xs">{tc.shiftStart} - {tc.shiftEnd}</td>
                      <td className="p-2 text-xs">{tc.event}</td>
                      <td className="p-2 font-semibold">{tc.totalHours}h</td>
                      <td className="p-2">${tc.hourlyRate.toFixed(2)}</td>
                      <td className="p-2 font-bold text-green-700">${tc.totalEarnings.toFixed(2)}</td>
                      <td className="p-2">
                        <button onClick={() => deleteTimecard(tc.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Eliminar</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PayrollSection({ timecards, employees, payroll, setPayroll }: any) {
  const [form, setForm] = useState({
    period: new Date().toISOString().split('T')[0],
    taxPercentage: 15
  })

  const generatePayroll = () => {
    if (!form.period) return alert('Selecciona un período')

    const monthYear = form.period.slice(0, 7)
    const periodTimecards = timecards.filter((tc: any) => tc.date.startsWith(monthYear))

    const payrollData: PayrollEntry[] = employees.map((emp: any) => {
      const empTimecards = periodTimecards.filter((tc: any) => tc.employeeId === emp.id)
      const totalHours = empTimecards.reduce((sum: number, tc: any) => sum + tc.totalHours, 0)
      const grossSalary = empTimecards.reduce((sum: number, tc: any) => sum + tc.totalEarnings, 0)
      const taxesDeductions = parseFloat((grossSalary * (form.taxPercentage / 100)).toFixed(2))
      const netSalary = parseFloat((grossSalary - taxesDeductions).toFixed(2))

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        totalHours,
        grossSalary,
        taxesDeductions,
        netSalary,
        period: monthYear,
        status: 'pending' as const
      }
    })

    setPayroll(payrollData)
    localStorage.setItem('payroll', JSON.stringify(payrollData))
    alert('Nómina generada!')
  }

  const updatePayrollStatus = (employeeId: string, status: 'pending' | 'approved' | 'processed') => {
    const updated = payroll.map((p: any) => p.employeeId === employeeId ? { ...p, status } : p)
    setPayroll(updated)
    localStorage.setItem('payroll', JSON.stringify(updated))
  }

  return (
    <div>
      <div className="bg-white border-2 border-black rounded p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-black pb-3">GENERAR NÓMINA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">PERÍODO (Mes-Año) *</label>
            <input type="month" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value + '-01' })} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">% IMPUESTOS / DEDUCCIONES</label>
            <input type="number" value={form.taxPercentage} onChange={(e) => setForm({ ...form, taxPercentage: parseFloat(e.target.value) })} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>
        <button onClick={generatePayroll} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GENERAR NÓMINA</button>
      </div>

      {payroll.length > 0 && (
        <div className="bg-white border-2 border-black rounded p-6">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-black pb-3">RESUMEN DE NÓMINA - {payroll[0]?.period}</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-2">EMPLEADO</th>
                  <th className="p-2">HORAS</th>
                  <th className="p-2">SALARIO BRUTO</th>
                  <th className="p-2">IMPUESTOS</th>
                  <th className="p-2">SALARIO NETO</th>
                  <th className="p-2">ESTADO</th>
                  <th className="p-2">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {payroll.map((p: any) => (
                  <tr key={p.employeeId} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold">{p.employeeName}</td>
                    <td className="p-2">{p.totalHours.toFixed(1)}h</td>
                    <td className="p-2">${p.grossSalary.toFixed(2)}</td>
                    <td className="p-2 text-red-600">${p.taxesDeductions.toFixed(2)}</td>
                    <td className="p-2 font-bold text-green-700">${p.netSalary.toFixed(2)}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === 'processed' ? 'bg-green-100 text-green-900' :
                        p.status === 'approved' ? 'bg-blue-100 text-blue-900' :
                        'bg-yellow-100 text-yellow-900'
                      }`}>
                        {p.status === 'processed' ? '✓ PROCESADO' : p.status === 'approved' ? '◆ APROBADO' : '● PENDIENTE'}
                      </span>
                    </td>
                    <td className="p-2 flex gap-1">
                      {p.status === 'pending' && <button onClick={() => updatePayrollStatus(p.employeeId, 'approved')} className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Aprobar</button>}
                      {p.status === 'approved' && <button onClick={() => updatePayrollStatus(p.employeeId, 'processed')} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Procesar</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded border">
              <p className="text-sm text-gray-600">TOTAL BRUTO</p>
              <p className="text-2xl font-bold text-black">${payroll.reduce((s: number, p: any) => s + p.grossSalary, 0).toFixed(2)}</p>
            </div>
            <div className="p-4 bg-red-50 rounded border">
              <p className="text-sm text-gray-600">IMPUESTOS TOTALES</p>
              <p className="text-2xl font-bold text-red-700">${payroll.reduce((s: number, p: any) => s + p.taxesDeductions, 0).toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded border">
              <p className="text-sm text-gray-600">NETO A PAGAR</p>
              <p className="text-2xl font-bold text-green-700">${payroll.reduce((s: number, p: any) => s + p.netSalary, 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-900 rounded">
            <h3 className="font-bold text-blue-900 mb-2">📤 EXPORTAR NÓMINA</h3>
            <p className="text-sm text-gray-700 mb-3">Futura integración con ADP, PayPross y otros sistemas de nómina. También calcularemos taxes automáticamente según gobierno.</p>
            <button className="px-4 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">EXPORTAR A ADP/PAYPROSS</button>
          </div>
        </div>
      )}
    </div>
  )
}

interface CreditCardGratuityProps {
  ccGratuities: CreditCardGratuity[]
  setCCGratuities: (data: CreditCardGratuity[]) => void
  employees: Employee[]
}

function CreditCardGratuitySection({ ccGratuities, setCCGratuities, employees }: CreditCardGratuityProps) {
  const [formData, setFormData] = useState<Partial<CreditCardGratuity>>({
    date: new Date().toISOString().split('T')[0],
    cardNetwork: 'visa',
    amount: 0,
    notes: ''
  })

  const handleAddGratuity = () => {
    if (!formData.employeeId || !formData.employeeName || !formData.amount || !formData.date) {
      alert('Por favor complete los campos requeridos')
      return
    }
    const newGratuity: CreditCardGratuity = {
      id: Date.now().toString(),
      date: formData.date || '',
      employeeId: formData.employeeId || '',
      employeeName: formData.employeeName || '',
      event: formData.event || '',
      cardNetwork: formData.cardNetwork || 'visa',
      amount: formData.amount || 0,
      notes: formData.notes || ''
    }
    const updated = [...ccGratuities, newGratuity]
    setCCGratuities(updated)
    localStorage.setItem('cc_gratuities', JSON.stringify(updated))
    setFormData({
      date: new Date().toISOString().split('T')[0],
      cardNetwork: 'visa',
      amount: 0,
      notes: ''
    })
  }

  const deleteGratuity = (id: string) => {
    const updated = ccGratuities.filter(g => g.id !== id)
    setCCGratuities(updated)
    localStorage.setItem('cc_gratuities', JSON.stringify(updated))
  }

  const gratuityByEmployee = employees.map(e => ({
    employee: e,
    total: ccGratuities.filter(g => g.employeeId === e.id).reduce((sum, g) => sum + g.amount, 0),
    count: ccGratuities.filter(g => g.employeeId === e.id).length
  })).filter(x => x.total > 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="p-4 bg-blue-50 rounded border border-blue-300">
        <h3 className="text-lg font-bold mb-4 text-black">REGISTRAR GRATUIDAD CC</h3>
        <div className="space-y-3">
          <select
            value={formData.employeeId || ''}
            onChange={(e) => {
              const emp = employees.find(x => x.id === e.target.value)
              setFormData({
                ...formData,
                employeeId: e.target.value,
                employeeName: emp?.name || ''
              })
            }}
            className="w-full p-2 border-2 border-black rounded"
          >
            <option value="">Seleccionar empleado</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <input
            type="text"
            placeholder="Evento (ej: Cena, Brunch)"
            value={formData.event || ''}
            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <select
            value={formData.cardNetwork || 'visa'}
            onChange={(e) => setFormData({ ...formData, cardNetwork: e.target.value as any })}
            className="w-full p-2 border-2 border-black rounded"
          >
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">American Express</option>
            <option value="discover">Discover</option>
          </select>
          <input
            type="number"
            placeholder="Monto ($)"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <textarea
            placeholder="Notas"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
            rows={3}
          />
          <button
            onClick={handleAddGratuity}
            className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            + AGREGAR GRATUIDAD
          </button>
        </div>
      </div>

      {/* Summary & Table */}
      <div className="lg:col-span-2 space-y-4">
        {/* Summary by Employee */}
        <div className="p-4 bg-green-50 rounded border border-green-300">
          <h3 className="font-bold mb-3 text-black">TOTAL GRATUIDADES CC POR EMPLEADO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gratuityByEmployee.map(item => (
              <div key={item.employee.id} className="p-2 bg-white rounded border border-gray-300">
                <p className="font-semibold text-black">{item.employee.name}</p>
                <p className="text-sm text-gray-600">{item.count} transacciones</p>
                <p className="text-lg font-bold text-green-700">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
          {gratuityByEmployee.length === 0 && <p className="text-gray-600 italic">Sin registros</p>}
        </div>

        {/* Table */}
        <div className="p-4 bg-white rounded border border-gray-300 overflow-x-auto">
          <h3 className="font-bold mb-3 text-black">HISTORIAL DE GRATUIDADES CC</h3>
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border text-left">FECHA</th>
                <th className="p-2 border text-left">EMPLEADO</th>
                <th className="p-2 border text-left">EVENTO</th>
                <th className="p-2 border text-left">TARJETA</th>
                <th className="p-2 border text-right">MONTO</th>
                <th className="p-2 border text-center">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {ccGratuities.map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{g.date}</td>
                  <td className="p-2 border">{g.employeeName}</td>
                  <td className="p-2 border">{g.event}</td>
                  <td className="p-2 border">{g.cardNetwork.toUpperCase()}</td>
                  <td className="p-2 border text-right font-semibold">${g.amount.toFixed(2)}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => deleteGratuity(g.id)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ccGratuities.length === 0 && <p className="text-gray-600 italic mt-2">Sin registros</p>}
        </div>
      </div>
    </div>
  )
}

interface EmployeeDirectoryProps {
  directoryEmployees: DirectoryEmployee[]
  setDirectoryEmployees: (data: DirectoryEmployee[]) => void
  employees: Employee[]
}

function EmployeeDirectorySection({ directoryEmployees, setDirectoryEmployees, employees }: EmployeeDirectoryProps) {
  const [formData, setFormData] = useState<Partial<DirectoryEmployee>>({
    status: 'active'
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Por favor complete los campos requeridos')
      return
    }

    const restaurantId = localStorage.getItem('active_restaurant_id') || 'default'

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('employees')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          position: formData.position || '',
          start_date: formData.startDate,
          status: formData.status || 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId)
      
      if (error) {
        console.error('Error updating employee:', error)
        alert('Error updating employee')
      } else {
        const updated = directoryEmployees.map(e =>
          e.id === editingId
            ? { ...e, ...formData, status: formData.status || 'active' }
            : e
        )
        setDirectoryEmployees(updated)
      }
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          position: formData.position || '',
          start_date: formData.startDate || new Date().toISOString().split('T')[0],
          status: formData.status || 'active',
          restaurant_id: restaurantId,
          user_id: '00000000-0000-0000-0000-000000000000'
        }])
        .select()
      
      if (error) {
        console.error('Error adding employee:', error)
        alert('Error adding employee')
      } else if (data) {
        const newEmployee: DirectoryEmployee = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email || '',
          position: data[0].position,
          phone: data[0].phone || '',
          startDate: data[0].start_date || '',
          status: data[0].status
        }
        setDirectoryEmployees([...directoryEmployees, newEmployee])
      }
    }

    setFormData({ status: 'active' })
    setEditingId(null)
  }

  const handleEdit = (emp: DirectoryEmployee) => {
    setFormData(emp)
    setEditingId(emp.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este empleado?')) return
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting employee:', error)
      alert('Error deleting employee')
    } else {
      setDirectoryEmployees(directoryEmployees.filter(e => e.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({ status: 'active' })
    setEditingId(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="p-4 bg-purple-50 rounded border border-purple-300">
        <h3 className="text-lg font-bold mb-4 text-black">{editingId ? 'EDITAR EMPLEADO' : 'AGREGAR EMPLEADO'}</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <input
            type="text"
            placeholder="Posición"
            value={formData.position || ''}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <input
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-2 border-2 border-black rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.status === 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
              className="w-4 h-4"
            />
            <label className="text-black font-semibold">Estado: {formData.status === 'active' ? '✓ Activo' : '✗ Inactivo'}</label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
            >
              {editingId ? 'ACTUALIZAR' : '+ AGREGAR'}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
              >
                CANCELAR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="lg:col-span-2 p-4 bg-white rounded border border-gray-300 overflow-x-auto">
        <h3 className="font-bold mb-4 text-black">DIRECTORIO DE EMPLEADOS ({directoryEmployees.length})</h3>
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-left">NOMBRE</th>
              <th className="p-2 border text-left">EMAIL</th>
              <th className="p-2 border text-left">TELÉFONO</th>
              <th className="p-2 border text-left">POSICIÓN</th>
              <th className="p-2 border text-left">INICIO</th>
              <th className="p-2 border text-center">ESTADO</th>
              <th className="p-2 border text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {directoryEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="p-2 border font-semibold">{emp.name}</td>
                <td className="p-2 border text-blue-600">{emp.email}</td>
                <td className="p-2 border">{emp.phone || '-'}</td>
                <td className="p-2 border">{emp.position || '-'}</td>
                <td className="p-2 border">{emp.startDate}</td>
                <td className="p-2 border text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    emp.status === 'active' 
                      ? 'bg-green-100 text-green-900'
                      : 'bg-red-100 text-red-900'
                  }`}>
                    {emp.status === 'active' ? '✓ ACTIVO' : '✗ INACTIVO'}
                  </span>
                </td>
                <td className="p-2 border text-center flex justify-center gap-1">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {directoryEmployees.length === 0 && <p className="text-gray-600 italic mt-2">Sin empleados registrados</p>}
      </div>
    </div>
  )
}
