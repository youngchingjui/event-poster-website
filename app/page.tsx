"use client"

import { useState } from "react"
import { PosterPreview } from "@/components/poster-preview"
import { DownloadButton } from "@/components/download-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [city, setCity] = useState("Shanghai")
  const [eventName, setEventName] = useState("AI Breakfast #21")
  const [tagline, setTagline] = useState("AI workflows • AI 2025 reflections • 2026 predictions")
  const [date, setDate] = useState("Thursday, Jan 1")
  const [time, setTime] = useState("9:00 – 10:30 AM")
  const [venue, setVenue] = useState("BAKER&SPICE")
  const [location, setLocation] = useState(
    "1717 West Nanjing Road, Wheelock Square\n南京西路1717号 会德丰国际广场南院首层101号商铺\n(Look for long table in the back)"
  )
  const [backgroundImageSrc, setBackgroundImageSrc] = useState("/luisa-fournier-hMjyyBqCRIs-unsplash.jpg")
  const [qrCodeSrc, setQrCodeSrc] = useState("/23.png")
  const [showQr, setShowQr] = useState(true)

  const posterProps = {
    city,
    eventName,
    tagline,
    date,
    time,
    venue,
    location,
    backgroundImageSrc,
    // Allow empty string to explicitly render the placeholder (reserve space)
    qrCodeSrc,
    showQr,
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">AI Breakfast Poster Generator</h1>
          <p className="text-muted-foreground mt-1">Create and download a clean, warm poster for this week’s AI Breakfast</p>
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
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Shanghai"
                    className="text-base"
                  />
                </div>

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
                  <Label htmlFor="tagline">Topics</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g., AI workflows • 2025 reflections • 2026 predictions"
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
                  <Label htmlFor="location">Address (multiline)</Label>
                  <Textarea
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={"Address line 1\nAddress line 2\n(Optional note)"}
                    className="text-base min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundImageSrc">Background image (local path)</Label>
                  <Input
                    id="backgroundImageSrc"
                    value={backgroundImageSrc}
                    onChange={(e) => setBackgroundImageSrc(e.target.value)}
                    placeholder="e.g., /ai-breakfast.jpg"
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qrCodeSrc">QR code image (optional)</Label>
                  <Input
                    id="qrCodeSrc"
                    value={qrCodeSrc}
                    onChange={(e) => setQrCodeSrc(e.target.value)}
                    placeholder="e.g., /23.png (clear to reserve space / show placeholder)"
                    className="text-base"
                  />
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full min-h-[56px] text-lg font-semibold"
                aria-pressed={showQr}
                onClick={() => setShowQr((v) => !v)}
              >
                {showQr ? "Hide QR code" : "Show QR code"}
              </Button>
              <DownloadButton {...posterProps} />
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Downloads as a 1080×1920px PNG image (perfect for Instagram Stories)
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Tip: the default background is <code className="font-mono">/luisa-fournier-hMjyyBqCRIs-unsplash.jpg</code>{" "}
              (from <code className="font-mono">public/</code>).
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
