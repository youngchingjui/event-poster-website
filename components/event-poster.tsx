"use client"

import { useMemo, useState } from "react"

interface EventPosterProps {
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

export function EventPoster({
  city = "Shanghai",
  eventName = "AI Breakfast #21",
  tagline = "AI workflows • 2025 reflections • 2026 predictions",
  date = "Thursday, Jan 1",
  time = "9:00 – 10:30 AM",
  venue = "BAKER&SPICE",
  location = "1717 West Nanjing Road, Wheelock Square\n南京西路1717号 会德丰国际广场南院首层101号商铺\n(Look for long table in the back)",
  qrCodeSrc = "/23.png",
  showQr = true,
  backgroundImageSrc = "/luisa-fournier-hMjyyBqCRIs-unsplash.jpg",
}: EventPosterProps) {
  const locationLines = useMemo(() => (location ?? "").split("\n").filter(Boolean), [location])

  const [imageSrc, setImageSrc] = useState(backgroundImageSrc)

  return (
    <div
      id="event-poster"
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{
        backgroundColor: "#F6EBDC",
      }}
    >
      {/* Photo (bottom half) */}
      <div className="absolute inset-0">
        <img
          alt="Breakfast table"
          src={imageSrc}
          className="absolute bottom-0 left-0 w-full h-[980px] object-cover"
          onError={() => setImageSrc("/placeholder.jpg")}
        />

        {/* Soft overlay to keep top text readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(246,235,220,1) 0%, rgba(246,235,220,1) 46%, rgba(246,235,220,0.65) 62%, rgba(246,235,220,0) 78%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-20 pt-20">
        <p
          className="text-[34px] tracking-wide"
          style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
        >
          {city}
        </p>

        <h1
          className="mt-6 text-[140px] leading-[0.95]"
          style={{
            color: "#C65B3C",
            fontFamily: 'ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, serif',
            letterSpacing: "-0.02em",
          }}
        >
          {eventName}
        </h1>

        <p
          className="mt-14 text-[54px] leading-tight"
          style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
        >
          {date} | {time}
        </p>

        <p
          className="mt-8 max-w-[880px] text-[34px] leading-relaxed"
          style={{ color: "#7A6B5E", fontFamily: "ui-serif, Georgia, Times, serif" }}
        >
          {tagline}
        </p>

        <div className="mt-16 space-y-3">
          <p
            className="text-[34px] tracking-wide"
            style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
          >
            {venue}
          </p>
          {locationLines.map((line, idx) => (
            <p
              key={`${idx}-${line}`}
              className="text-[30px] leading-snug"
              style={{ color: "#7A6B5E", fontFamily: "ui-serif, Georgia, Times, serif" }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* QR code area */}
      {showQr ? (
        <div className="absolute right-20 bottom-20 z-20">
          <div
            className="w-[360px] h-[360px] bg-white"
            style={{
              border: "6px solid #7B8B76",
              boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
            }}
          >
            {qrCodeSrc ? (
              <img alt="QR code" src={qrCodeSrc} className="w-full h-full object-contain p-6" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div
                  className="w-full flex-1 rounded-md"
                  style={{
                    border: "2px dashed rgba(111,98,87,0.35)",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(198,91,60,0.06), transparent 55%), radial-gradient(circle at 70% 70%, rgba(123,139,118,0.08), transparent 55%)",
                  }}
                />
                <p
                  className="text-[22px]"
                  style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
                >
                  QR code goes here
                </p>
              </div>
            )}
          </div>
          <p
            className="mt-3 text-right text-[22px]"
            style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
          >
            Scan to register
          </p>
        </div>
      ) : null}
    </div>
  )
}
