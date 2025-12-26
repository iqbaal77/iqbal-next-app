"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../lib/validators'
import { z } from 'zod'
import { motion } from 'framer-motion'

type FormData = z.infer<typeof registerSchema>;

export default function Register(){
  const [err,setErr]=useState('');
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(registerSchema)
  })

  async function onSubmit(data: FormData){
    setErr('');
    try{
      const r = await fetch('/api/auth/register',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data), credentials: 'same-origin'})
      const j = await r.json().catch(()=>({}));
      if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`)
      router.push('/dashboard')
    }catch(e:any){ setErr(e.message || 'Registration failed') }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Register</h2>
        {err && <div className="text-red-600">{err}</div>}
        <div>
          <input className="form-input w-full" {...register('name')} placeholder="Name" />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input className="form-input w-full" {...register('email')} placeholder="Email" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input className="form-input w-full" type="password" {...register('password')} placeholder="Password" />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-between items-center">
          <Button type="submit" disabled={isSubmitting} className="px-4">{isSubmitting? 'Registering...' : 'Register'}</Button>
          <Link href="/login" className="text-sm text-gray-600">Already have an account? Login</Link>
        </div>
      </motion.form>
    </div>
  )
}
