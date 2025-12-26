"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'

export default function Header(){
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(()=>{
    let mounted = true
    fetch('/api/auth/user', { credentials: 'same-origin' })
      .then(r=>r.json())
      .then(j=>{ if (!mounted) return; if (j?.ok) setUser(j.user); else setUser(null) })
      .catch(()=>{ if (mounted) setUser(null) })
      .finally(()=>{ if (mounted) setLoading(false) })
    return ()=>{ mounted = false }
  },[])

  async function handleLogout(){
    try{
      const r = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      if (!r.ok) { alert('Logout failed'); return }
      setUser(null)
      router.push('/')
    }catch(e:any){
      alert(e?.message || 'Logout failed')
    }
  }

  return (
    <header className="bg-white shadow mb-6">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 6h18M3 14h18M3 18h18" /></svg>
            Iqbal's Ecom
          </Link>
          <nav className="hidden md:flex gap-3">
            <Link href="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
          </nav>
        </div>
        <div>
          {loading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user.name}</span>
              <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login"><Button className="bg-blue-600 hover:bg-blue-700">Login</Button></Link>
              <Link href="/register" className="inline-block"><span className="px-3 py-1 border rounded text-sm">Register</span></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
