"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'

export default function Shop(){
  const [products, setProducts] = useState<any[]>([])
  useEffect(()=>{
    fetch('/api/products').then(r=>r.json()).then(j=> setProducts(j.products || []))
  },[])
  return (
    <div>
      <h2 className="text-xl font-bold">Shop</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <AnimatePresence>
          {products.map((p:any, idx: number)=>(
            <Card key={p.id} className="p-4 bg-white overflow-hidden">
               <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {p.image? <img src={p.image} alt={p.name} className="h-full object-cover w-full" /> : 'No Image'}
                </div>
                <h3 className="mt-2 font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">${Number(p.price).toFixed(2)}</p>
            </Card>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
