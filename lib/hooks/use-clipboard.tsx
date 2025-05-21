"use client"

import { useState, useCallback } from "react"

type UseClipboardOptions = {
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options
  const [hasCopied, setHasCopied] = useState(false)
  const [value, setValue] = useState<string>("")

  const onCopy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setValue(text)
        setHasCopied(true)

        setTimeout(() => {
          setHasCopied(false)
        }, timeout)

        return true
      } catch (error) {
        console.error("Failed to copy text:", error)
        return false
      }
    },
    [timeout],
  )

  return {
    copy: onCopy,
    hasCopied,
    value,
    status: hasCopied ? "copied" : "idle",
  }
}
