"use client"
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {productSchema} from "../lib/validators";

type FormData = z.infer<typeof productSchema> & { _id?: string | number };

export default function ProductForm({ defaultValues }: { defaultValues?: Partial<FormData> }){
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: defaultValues as any
  })
  async function onSubmit(data: FormData){
    try{
      const id = defaultValues?._id
      const isEdit = !!id
      const url = isEdit? `/api/products/${id}` : '/api/products'
      const method = isEdit? 'PATCH' : 'POST'
      const send = {
        name: data.name,
        price: Number(data.price),
        description: data.description || '',
        image: data.image || ''
      }
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(send), credentials: 'same-origin' })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed')
      router.push('/dashboard/products')
    }catch(e:any){ alert(e.message) }
  }
  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      <input type="hidden" {...register('_id')} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input {...register('name')} className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="w-full p-2 border rounded" />
        {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image (URL or data URI)</label>
        <input {...register('image')} className="w-full p-2 border rounded" />
        {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} className="w-full p-2 border rounded" />
        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </motion.button>
      </div>
    </motion.form>
  );
}
