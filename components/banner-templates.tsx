"use client"

import { ImageWithFallback } from "./image-with-fallback"

export interface BannerProps {
  eventName: string
  date: string
  location: string
  city: string
  image: string
  width?: number
  height?: number
}

export const ClassicBanner = ({
  eventName,
  date,
  location,
  city,
  image,
  width = 1080,
  height = 640,
}: BannerProps) => {
  return (
    <div
      className="relative bg-[#F6EBDC] flex overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%", aspectRatio: `${width}/${height}` }}
    >
      {/* Left content */}
      <div className="flex-1 p-16 flex flex-col justify-center">
        {/* Group 1: Header (City + Event Name) */}
        <div className="mb-7">
          {/* City label */}
          <span
            className="text-[24px] tracking-wide block mb-2"
            style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
          >
            {city}
          </span>

          {/* Event Name */}
          <h1
            className="leading-[0.95] whitespace-nowrap"
            style={{
              color: "#C65B3C",
              fontFamily: 'ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, serif',
              letterSpacing: "-0.02em",
              fontSize: `${Math.min(110, width / 10)}px`
            }}
          >
            {eventName}
          </h1>
        </div>

        {/* Group 2: Details (Date + Location) */}
        <div>
          {/* Date & Time */}
          <p
            className="text-[36px] leading-tight mb-3"
            style={{ color: "#6F6257", fontFamily: "ui-serif, Georgia, Times, serif" }}
          >
            {date}
          </p>

          {/* Location */}
          <p
            className="text-[24px] tracking-wide"
            style={{ color: "#7A6B5E", fontFamily: "ui-serif, Georgia, Times, serif" }}
          >
            {location}
          </p>
        </div>
      </div>

      {/* Right image section */}
      <div className="w-2/5 relative">
        <ImageWithFallback
          src={image}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Banner background"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(246,235,220,1) 0%, rgba(246,235,220,0.65) 30%, rgba(246,235,220,0) 60%)"
          }}
        />
      </div>
    </div>
  )
}
