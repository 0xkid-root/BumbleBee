import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  message: string
  error: string | null
}

export function LoadingOverlay({ message, error }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{message}</h3>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}