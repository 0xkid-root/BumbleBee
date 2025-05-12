"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckIcon, Loader2 } from "lucide-react"

// Registration form schema with validation
const registrationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores, and hyphens",
    })
    .trim(),
})

type RegistrationFormValues = z.infer<typeof registrationFormSchema>

interface RegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegister: (data: RegistrationFormValues) => Promise<void>
  walletAddress: string
  chainName: string
  isLoading: boolean
}

export function RegistrationModal({
  open,
  onOpenChange,
  onRegister,
  walletAddress,
  chainName,
  isLoading,
}: RegistrationModalProps) {
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onChange", // Validate on change for better UX
  })

  const handleSubmit = async (data: RegistrationFormValues) => {
    try {
      if (!walletAddress) {
        toast.error("Wallet not connected", {
          description: "Please connect your wallet before registering.",
        })
        return
      }

      // Submit registration
      await onRegister(data)

      form.reset()
      toast.success("Registration successful", {
        description: "Welcome to Bumblebee!",
      })
      onOpenChange(false) // Close modal on success
    } catch (error: any) {
      toast.dismiss()

      // Handle specific error cases
      if (error?.message?.includes("duplicate key")) {
        toast.error("Registration failed", {
          description: "This username or wallet address is already registered.",
        })
      } else {
        toast.error("Registration failed", {
          description: "An error occurred. Please try again later.",
        })
      }
    }
  }

  // Framer Motion variants for animations (optimized for performance)
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  }

  const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px] overflow-hidden">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <DialogHeader>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fieldVariants}
                  transition={{ delay: 0.1 }}
                >
                  <DialogTitle className="text-2xl">Complete Registration</DialogTitle>
                  <DialogDescription>
                    Your wallet is connected. Complete your profile to continue.
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fieldVariants}
                    transition={{ delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fieldVariants}
                    transition={{ delay: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be your unique identifier on the platform.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fieldVariants}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="space-y-2">
                      <FormLabel>Connected Wallet</FormLabel>
                      <div className="p-3 bg-secondary/20 rounded-md text-sm font-mono break-all">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                      <FormDescription>
                        This wallet address is linked to your account.
                      </FormDescription>
                    </div>
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fieldVariants}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="space-y-2">
                      <FormLabel>Connected Network</FormLabel>
                      <div className="p-3 bg-secondary/20 rounded-md text-sm">
                        {chainName}
                      </div>
                    </div>
                  </motion.div>

                  <DialogFooter>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fieldVariants}
                      transition={{ delay: 0.6 }}
                      className="w-full"
                    >
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !form.formState.isValid}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Complete Registration
                            <CheckIcon className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}