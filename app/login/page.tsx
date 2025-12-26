"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../../components/ui/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../lib/validators'
import { z } from 'zod'
import { motion } from 'framer-motion'

type FormData = z.infer<typeof loginSchema>;

export default function Login(){
  const router = useRouter();
  const [error,setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: FormData) => {
    setError('');
    try{
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'same-origin' })
      const j = await res.json()
      if (!res.ok) { setError(j.error || 'Login failed'); return }
      router.push('/dashboard')
    }catch(err:any){
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h1 className="text-xl font-bold">Login</h1>
        {error && <p className="text-red-600">{error}</p>}
        <div>
          <input className="form-input w-full" placeholder="Email" type="email" {...register('email')} />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input className="form-input w-full" placeholder="Password" type="password" {...register('password')} />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-between items-center">
          <Button type="submit" disabled={isSubmitting} className="px-4">{isSubmitting? 'Logging...':'Login'}</Button>
          <Link href="/register" className="text-sm text-gray-600">No account? Register</Link>
        </div>
      </motion.form>
    </div>
  )
}
