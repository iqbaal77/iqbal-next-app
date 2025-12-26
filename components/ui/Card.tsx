"use client"
import React from 'react'
import { motion } from 'framer-motion'

export default function Card({ children, className = '' }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  )
}

