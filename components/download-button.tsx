"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  city?: string
  eventName?: string
  tagline?: string
  date?: string
  time?: string
  venue?: string
  location?: string
  qrCodeSrc?: string
  showQr?: boolean
  backgroundImageSrc?: string
}

export function DownloadButton(props: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // Build URL with search params for the OG image API
      const params = new URLSearchParams()
      if (props.city) params.set("city", props.city)
      if (props.eventName) params.set("eventName", props.eventName)
      if (props.tagline) params.set("tagline", props.tagline)
      if (props.date) params.set("date", props.date)
      if (props.time) params.set("time", props.time)
      if (props.venue) params.set("venue", props.venue)
      if (props.location) params.set("location", props.location)
      if (props.qrCodeSrc) params.set("qrCodeSrc", props.qrCodeSrc)
      if (props.showQr !== undefined) params.set("showQr", String(props.showQr))
      if (props.backgroundImageSrc) params.set("backgroundImageSrc", props.backgroundImageSrc)

      const response = await fetch(`/api/og-poster?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to generate poster")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `event-poster-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading poster:", error)
      alert("Failed to download poster. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      size="lg"
      className="w-full min-h-[56px] text-lg font-semibold gap-3"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download Poster
        </>
      )}
    </Button>
  )
}
