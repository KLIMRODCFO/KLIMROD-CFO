"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoLogin() {
  const router = useRouter()

  useEffect(() => {
    try {
      const demo = { id: '1', email: 'admin@klimrod.com', name: 'admin' }
      localStorage.setItem('user', JSON.stringify(demo))
      localStorage.setItem('auth_token', 'token_demo')
      // small delay to ensure storage is set
      setTimeout(() => {
        router.replace('/business-unit')
      }, 200)
    } catch (e) {
      console.error('Auto login failed', e)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white border rounded">Autenticando demo... redirigiendo.</div>
    </div>
  )
}
