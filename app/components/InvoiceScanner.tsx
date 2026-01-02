"use client"

import { useState } from 'react'

interface InvoiceItem {
  id: string
  product_name: string
  cases?: number
  bottles?: number
  unit_price: number
  total_price: number
}

interface InvoiceScannerProps {
  onDataExtracted: (data: {
    vendor?: string
    amount?: number
    date?: string
    delivery_number?: string
    payment_terms?: string
    description?: string
    items?: InvoiceItem[]
  }) => void
}

export default function InvoiceScanner({ onDataExtracted }: InvoiceScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setProgress(10)

    try {
      setProgress(30)

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setProgress(50)

      // Call our API route
      const response = await fetch('/api/scan-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64 })
      })

      setProgress(80)

      if (!response.ok) {
        let errorMessage = 'Failed to scan invoice'
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
        } catch {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      setProgress(100)

      if (result.success && result.data) {
        const items = result.data.items?.map((item: any, idx: number) => ({
          id: `item-${Date.now()}-${idx}`,
          product_name: item.product_name || '',
          cases: item.cases || undefined,
          bottles: item.bottles || undefined,
          unit_price: parseFloat(item.unit_price) || 0,
          total_price: parseFloat(item.total_price) || 0
        })) || []

        onDataExtracted({
          vendor: result.data.vendor || undefined,
          amount: result.data.amount ? parseFloat(result.data.amount) : undefined,
          date: result.data.date || undefined,
          delivery_number: result.data.delivery_number || undefined,
          payment_terms: result.data.payment_terms || undefined,
          description: `Invoice scan - ${items.length} items`,
          items: items.length > 0 ? items : undefined
        })
      } else {
        console.error('Failed to parse invoice data:', result)
        throw new Error(result.error || 'Could not extract invoice data')
      }

    } catch (error: any) {
      console.error('Scan error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsScanning(false)
      setProgress(0)
    }
  }

  return (
    <div className="bg-white p-6">
      <div>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleImageUpload}
          disabled={isScanning}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-6 file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer disabled:opacity-50"
        />
      </div>

      {isScanning && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Processing</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-1">
            <div
              className="bg-black h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
