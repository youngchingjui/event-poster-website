"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BannerDownloadButtonProps {
  eventName: string
  eventNumber?: string
  date: string
  location: string
  city: string
  backgroundImageSrc: string
  width: number
  height: number
}

export function BannerDownloadButton({
  eventName,
  eventNumber,
  date,
  location,
  city,
  backgroundImageSrc,
  width,
  height,
}: BannerDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("eventName", eventName)
      if (eventNumber) params.set("eventNumber", eventNumber)
      params.set("date", date)
      params.set("location", location)
      params.set("city", city)
      params.set("width", String(width))
      params.set("height", String(height))
      if (backgroundImageSrc) {
        params.set("backgroundImageSrc", backgroundImageSrc)
      }

      const response = await fetch(`/api/og-banner?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to generate banner")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      // Create filename from event name and number
      const safeTitle = eventName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
      const suffix = eventNumber ? `-${eventNumber.replace(/[^a-zA-Z0-9]/g, "")}` : ""
      a.download = `banner-${safeTitle}${suffix}-${width}x${height}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading banner:", error)
      alert("Failed to download banner. Please try again.")
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
          Download Banner
        </>
      )}
    </Button>
  )
}
