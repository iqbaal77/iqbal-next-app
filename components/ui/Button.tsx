"use client"
import React from 'react'
import { motion } from 'framer-motion'

export default function Button({ children, className = '', onClick, type = 'button', disabled = false }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-primary disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  )
}

