"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsPage(){
  const [prods, setProds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try{
      const r = await fetch('/api/products')
      const j = await r.json()
      // ensure we use the correct array if API returns { ok: true, products: [...] }
      setProds(j.products || j || [])
    }catch(e:any){
      setError('Failed to load products')
    } finally { setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  async function handleDelete(id:any){
    if (!confirm('Delete this product?')) return
    try{
      const r = await fetch(`/api/products/${id}`, { method: 'DELETE', credentials: 'same-origin' })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Delete failed')
      // optimistic remove
      setProds((p:any[])=>p.filter(x=>String(x.id)!==String(id)))
    }catch(e:any){ alert(e.message || 'Delete failed') }
  }

  if (loading) return <div>Loading products...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <h2 className="text-xl font-bold">Products</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {prods.map((p:any, idx: number)=>(
            <motion.div
              key={p.id}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">${Number(p.price).toFixed(2)}</p>
              <div className="mt-2 flex gap-2">
                <Link href={`/dashboard/products/${p.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <button onClick={()=>handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
