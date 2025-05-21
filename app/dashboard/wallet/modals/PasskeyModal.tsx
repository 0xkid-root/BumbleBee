import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Shield, Check, Loader2, Info, AlertCircle } from 'lucide-react'
import type { PasskeyCredential } from '../../../../lib/types'

interface PasskeyModalProps {
  isOpen: boolean
  onClose: () => void
  onRegister: () => Promise<void>
  isLoading: boolean
  isRegistered: boolean
  error: string | null
  passkey: PasskeyCredential | null
}

export function PasskeyModal({
  isOpen,
  onClose,
  onRegister,
  isLoading,
  isRegistered,
  error,
  passkey
}: PasskeyModalProps) {
  // Implementation...
}