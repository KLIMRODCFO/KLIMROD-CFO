"use client"

import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'

interface BusinessSettings {
  BUSINESS_NAME: string
  LEGAL_NAME: string
  EIN: string
  BUSINESS_TYPE: string
  INDUSTRY: string
  START_DATE: string
  TAX_ID: string
  ADDRESS_LINE_1: string
  ADDRESS_LINE_2: string
  CITY: string
  STATE: string
  ZIP_CODE: string
  COUNTRY: string
  PHONE_NUMBER: string
  EMAIL: string
  WEBSITE_URL: string
  BANK_NAME: string
  BANK_ACCOUNT_NAME: string
  BANK_ACCOUNT_NUMBER: string
  ROUTING_NUMBER: string
  BANK_ADDRESS: string
  CURRENCY: string
}

export default function BusinessSettingsPage() {
  const [form, setForm] = useState<BusinessSettings>({
    BUSINESS_NAME: '',
    LEGAL_NAME: '',
    EIN: '',
    BUSINESS_TYPE: '',
    INDUSTRY: '',
    START_DATE: '',
    TAX_ID: '',
    ADDRESS_LINE_1: '',
    ADDRESS_LINE_2: '',
    CITY: '',
    STATE: '',
    ZIP_CODE: '',
    COUNTRY: 'USA',
    PHONE_NUMBER: '',
    EMAIL: '',
    WEBSITE_URL: '',
    BANK_NAME: '',
    BANK_ACCOUNT_NAME: '',
    BANK_ACCOUNT_NUMBER: '',
    ROUTING_NUMBER: '',
    BANK_ADDRESS: '',
    CURRENCY: 'USD'
  })

  useEffect(() => {
    const stored = localStorage.getItem('business_settings')
    if (stored) setForm(JSON.parse(stored))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('business_settings', JSON.stringify(form))
    alert('Business settings guardadas!')
  }

  const maskAccount = (value: string) => (value ? value.replace(/.(?=.{4})/g, '*') : '')

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-black mb-4">BUSINESS SETTINGS</h1>

        <form onSubmit={handleSave} className="bg-white border-2 border-black rounded p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">BUSINESS NAME</label>
              <input name="BUSINESS_NAME" value={form.BUSINESS_NAME} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">LEGAL NAME</label>
              <input name="LEGAL_NAME" value={form.LEGAL_NAME} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">EIN</label>
              <input name="EIN" value={form.EIN} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">BUSINESS TYPE</label>
              <input name="BUSINESS_TYPE" value={form.BUSINESS_TYPE} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="LLC, Corp, Sole Prop" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">INDUSTRY</label>
              <input name="INDUSTRY" value={form.INDUSTRY} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">START DATE</label>
              <input type="date" name="START_DATE" value={form.START_DATE} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">TAX ID</label>
              <input name="TAX_ID" value={form.TAX_ID} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-lg mb-3">Dirección y contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">ADDRESS LINE 1</label>
                <input name="ADDRESS_LINE_1" value={form.ADDRESS_LINE_1} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ADDRESS LINE 2</label>
                <input name="ADDRESS_LINE_2" value={form.ADDRESS_LINE_2} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">CITY</label>
                <input name="CITY" value={form.CITY} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">STATE</label>
                <input name="STATE" value={form.STATE} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ZIP CODE</label>
                <input name="ZIP_CODE" value={form.ZIP_CODE} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">COUNTRY</label>
                <select name="COUNTRY" value={form.COUNTRY} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                  <option value="USA">USA</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">PHONE NUMBER</label>
                <input name="PHONE_NUMBER" value={form.PHONE_NUMBER} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">EMAIL</label>
                <input type="email" name="EMAIL" value={form.EMAIL} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">WEBSITE URL</label>
                <input name="WEBSITE_URL" value={form.WEBSITE_URL} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="https://" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-lg mb-3">Información bancaria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">BANK NAME</label>
                <input name="BANK_NAME" value={form.BANK_NAME} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ACCOUNT NAME</label>
                <input name="BANK_ACCOUNT_NAME" value={form.BANK_ACCOUNT_NAME} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ACCOUNT NUMBER (enmascarado)</label>
                <input name="BANK_ACCOUNT_NUMBER" value={form.BANK_ACCOUNT_NUMBER} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                {form.BANK_ACCOUNT_NUMBER && (
                  <p className="text-xs text-gray-600 mt-1">Guardado como: {maskAccount(form.BANK_ACCOUNT_NUMBER)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ROUTING NUMBER</label>
                <input name="ROUTING_NUMBER" value={form.ROUTING_NUMBER} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">BANK ADDRESS</label>
                <input name="BANK_ADDRESS" value={form.BANK_ADDRESS} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">CURRENCY</label>
                <select name="CURRENCY" value={form.CURRENCY} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, BANK_ACCOUNT_NUMBER: '' }))}
              className="px-6 py-2 border-2 border-black font-semibold rounded hover:bg-gray-100"
            >
              Limpiar cuenta
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}
