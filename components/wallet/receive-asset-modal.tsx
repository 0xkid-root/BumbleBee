"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Asset } from "@/lib/store/use-wallet-store"
import { Copy, Check, QrCode } from "lucide-react"
import Image from "next/image"
import { useClipboard } from "@/lib/hooks/use-clipboard"
import { QRCodeSVG } from "qrcode.react"

export type ReceiveAssetModalProps = {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
  walletAddress: string
}

export function ReceiveAssetModal({ isOpen, onClose, asset, walletAddress }: ReceiveAssetModalProps) {
  const { copy, status } = useClipboard()
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    copy(walletAddress)
  }

  const handleDownloadQR = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create an image from the SVG
    const img = document.createElement('img')
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw white background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      ctx.drawImage(img, 0, 0)

      // Convert to PNG and download
      const pngUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = pngUrl
      link.download = `${asset?.symbol || "wallet"}-address-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)
    }

    img.crossOrigin = "anonymous"
    img.src = url
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {asset && (
              <div className="relative h-6 w-6 rounded-full overflow-hidden">
                <Image
                  src={asset.logo || "/placeholder.svg"}
                  alt={`${asset.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            Receive {asset?.symbol}
          </DialogTitle>
          <DialogDescription>Share your wallet address to receive {asset?.name}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 space-y-4">
          {showQR ? (
            <div ref={qrRef} className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={walletAddress}
                size={200}
                level="H"
                includeMargin={true}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
              />
            </div>
          ) : (
            <div className="w-full p-4 bg-muted rounded-lg break-all text-center">{walletAddress}</div>
          )}

          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowQR(!showQR)}>
              {showQR ? (
                "Show Address"
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Show QR Code
                </>
              )}
            </Button>

            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              {status === "copied" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </>
              )}
            </Button>
          </div>

          {showQR && (
            <Button variant="outline" onClick={handleDownloadQR}>
              Download QR Code
            </Button>
          )}

          <div className="text-sm text-muted-foreground text-center mt-4">
            <p>Only send {asset?.symbol} to this address.</p>
            <p>Sending any other assets may result in permanent loss.</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
