'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} // Empieza un poquito más abajo y transparente
      animate={{ y: 0, opacity: 1 }}   // Sube a su posición original y se vuelve opaco
      transition={{ ease: 'easeInOut', duration: 0.5 }} // Duración del efecto
    >
      {children}
    </motion.div>
  )
}