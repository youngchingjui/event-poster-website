"use client"

import { EventPoster } from "./event-poster"

interface PosterPreviewProps {
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

export function PosterPreview(props: PosterPreviewProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      {/* Scaled down preview */}
      <div
        className="relative overflow-hidden rounded-lg border border-border shadow-2xl"
        style={{
          aspectRatio: "1080 / 1920",
        }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: "1080px",
            height: "1920px",
            transform: "scale(0.37)",
          }}
        >
          <EventPoster {...props} />
        </div>
      </div>
    </div>
  )
}
