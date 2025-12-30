"use client"

import { useState } from "react"
import { PosterPreview } from "@/components/poster-preview"
import { DownloadButton } from "@/components/download-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [eventName, setEventName] = useState("NEON NIGHTS")
  const [tagline, setTagline] = useState("An Immersive Electronic Music Experience")
  const [date, setDate] = useState("MARCH 15, 2025")
  const [time, setTime] = useState("8:00 PM — 2:00 AM")
  const [venue, setVenue] = useState("THE WAREHOUSE")
  const [location, setLocation] = useState("Brooklyn, New York")
  const [ticketInfo, setTicketInfo] = useState("Early Bird $45 • General $65")

  const posterProps = {
    eventName,
    tagline,
    date,
    time,
    venue,
    location,
    ticketInfo,
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Event Poster Generator</h1>
          <p className="text-muted-foreground mt-1">Create and download beautiful event posters</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Editor Panel */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Customize Your Poster</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Enter tagline"
                    className="text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g., MARCH 15, 2025"
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g., 8:00 PM"
                      className="text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Enter venue name"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticketInfo">Ticket Info</Label>
                  <Input
                    id="ticketInfo"
                    value={ticketInfo}
                    onChange={(e) => setTicketInfo(e.target.value)}
                    placeholder="Ticket pricing info"
                    className="text-base"
                  />
                </div>
              </div>
            </div>

            {/* Download Button */}
            <DownloadButton {...posterProps} />

            <p className="text-sm text-muted-foreground text-center">
              Downloads as a 1080×1920px PNG image (perfect for Instagram Stories)
            </p>
          </div>

          {/* Preview Panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground text-center lg:text-left">Preview</h2>
              <PosterPreview {...posterProps} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
