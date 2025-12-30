"use client"

import { useState, useEffect } from "react"
import { CalendarDays, MapPin, Clock, Ticket } from "lucide-react"

interface EventPosterProps {
  eventName?: string
  tagline?: string
  date?: string
  time?: string
  venue?: string
  location?: string
  ticketInfo?: string
}

export function EventPoster({
  eventName = "NEON NIGHTS",
  tagline = "An Immersive Electronic Music Experience",
  date = "MARCH 15, 2025",
  time = "8:00 PM — 2:00 AM",
  venue = "THE WAREHOUSE",
  location = "Brooklyn, New York",
  ticketInfo = "Early Bird $45 • General $65",
}: EventPosterProps) {
  // Generate decorative lines only on client side to avoid hydration mismatch
  const [decorativeLines, setDecorativeLines] = useState<
    Array<{ width: number; left: number; rotation: number }>
  >([])

  useEffect(() => {
    setDecorativeLines(
      Array.from({ length: 20 }).map(() => ({
        width: Math.random() * 300 + 100,
        left: Math.random() * 100,
        rotation: Math.random() * 30 - 15,
      }))
    )
  }, [])

  return (
    <div
      id="event-poster"
      className="relative w-[1080px] h-[1920px] bg-background overflow-hidden flex flex-col"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {decorativeLines.map((line, i) => (
            <div
              key={i}
              className="absolute bg-primary/30"
              style={{
                width: `${line.width}px`,
                height: "1px",
                top: `${i * 100}px`,
                left: `${line.left}%`,
                transform: `rotate(${line.rotation}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Top accent bar */}
      <div className="h-3 bg-primary w-full" />

      {/* Header section */}
      <div className="px-16 pt-16 pb-8">
        <p className="text-muted-foreground text-3xl tracking-[0.3em] uppercase">presents</p>
      </div>

      {/* Main title area */}
      <div className="flex-1 flex flex-col justify-center px-16">
        {/* Event name - massive typography */}
        <h1 className="text-[180px] font-bold leading-[0.85] tracking-tight text-foreground">
          {eventName.split(" ").map((word, i) => (
            <span key={i} className="block">
              {i === 1 ? <span className="text-primary">{word}</span> : word}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p className="text-4xl text-muted-foreground mt-12 max-w-[700px] leading-relaxed">{tagline}</p>

        {/* Decorative element */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px bg-border flex-1 max-w-[200px]" />
          <div className="w-4 h-4 bg-primary rotate-45" />
          <div className="h-px bg-border flex-1 max-w-[200px]" />
        </div>
      </div>

      {/* Event details */}
      <div className="px-16 pb-20">
        <div className="grid grid-cols-2 gap-8">
          {/* Date & Time */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <CalendarDays className="w-10 h-10 text-primary" />
              <div>
                <p className="text-muted-foreground text-xl uppercase tracking-wider">Date</p>
                <p className="text-4xl font-semibold text-foreground">{date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-primary" />
              <div>
                <p className="text-muted-foreground text-xl uppercase tracking-wider">Time</p>
                <p className="text-4xl font-semibold text-foreground">{time}</p>
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <MapPin className="w-10 h-10 text-primary" />
              <div>
                <p className="text-muted-foreground text-xl uppercase tracking-wider">Venue</p>
                <p className="text-4xl font-semibold text-foreground">{venue}</p>
                <p className="text-2xl text-muted-foreground">{location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket info */}
        <div className="mt-12 pt-12 border-t border-border">
          <div className="flex items-center gap-4">
            <Ticket className="w-10 h-10 text-primary" />
            <div>
              <p className="text-muted-foreground text-xl uppercase tracking-wider">Tickets</p>
              <p className="text-3xl font-semibold text-foreground">{ticketInfo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-3 bg-primary w-full" />
    </div>
  )
}
