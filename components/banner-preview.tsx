"use client"

import { useMemo } from "react"
import { ClassicBanner } from "./banner-templates"

interface BannerPreviewProps {
  eventName: string
  date: string
  location: string
  city: string
  image: string
  width: number
  height: number
}

export function BannerPreview({
  eventName,
  date,
  location,
  city,
  image,
  width,
  height,
}: BannerPreviewProps) {
  // Calculate scale to fit preview container (max 600px wide)
  const maxPreviewWidth = 600
  const scale = useMemo(() => Math.min(1, maxPreviewWidth / width), [width])

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div
        className="relative overflow-hidden rounded-lg border border-border shadow-2xl"
        style={{
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
          }}
        >
          <ClassicBanner
            eventName={eventName}
            date={date}
            location={location}
            city={city}
            image={image}
            width={width}
            height={height}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-2">
        {width} x {height} px
      </p>
    </div>
  )
}
