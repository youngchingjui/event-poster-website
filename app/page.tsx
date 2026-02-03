"use client";

import { useState, useEffect } from "react";
import { PosterPreview } from "@/components/poster-preview";
import { DownloadButton } from "@/components/download-button";
import { BannerPreview } from "@/components/banner-preview";
import { BannerDownloadButton } from "@/components/banner-download-button";
import { ImagePicker, ImageOption } from "@/components/image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { presetBackgrounds, presetQRCodes } from "@/lib/preset-images";

const STORAGE_KEY = "ai-breakfast-poster-data";

type Tab = "poster" | "banner";

interface SavedData {
  city: string;
  eventName: string;
  tagline: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  backgroundImageSrc: string;
  qrCodeSrc: string;
  showQr: boolean;
  bannerWidth: number;
  bannerHeight: number;
}

export default function Home() {
  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("poster");
  const [isLoaded, setIsLoaded] = useState(false);

  // Shared event details (defaults)
  const [city, setCity] = useState("Shanghai");
  const [eventName, setEventName] = useState("AI Breakfast #21");
  const [tagline, setTagline] = useState(
    "AI workflows • AI 2025 reflections • 2026 predictions"
  );
  const [date, setDate] = useState("Thursday, Jan 1");
  const [time, setTime] = useState("9:00 – 10:30 AM");
  const [venue, setVenue] = useState("BAKER&SPICE");
  const [location, setLocation] = useState(
    "1717 West Nanjing Road, Wheelock Square\n南京西路1717号 会德丰国际广场南院首层101号商铺\n(Look for long table in the back)"
  );
  const [backgroundImageSrc, setBackgroundImageSrc] = useState(
    presetBackgrounds[0]?.url || ""
  );
  const [qrCodeSrc, setQrCodeSrc] = useState(presetQRCodes[0]?.url || "");
  const [showQr, setShowQr] = useState(true);

  // Banner-specific state
  const [bannerWidth, setBannerWidth] = useState(1080);
  const [bannerHeight, setBannerHeight] = useState(640);

  // Track user-uploaded images
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState<ImageOption[]>([]);
  const [uploadedQRCodes, setUploadedQRCodes] = useState<ImageOption[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: SavedData = JSON.parse(saved);
        setCity(data.city);
        setEventName(data.eventName);
        setTagline(data.tagline);
        setDate(data.date);
        setTime(data.time);
        setVenue(data.venue);
        setLocation(data.location);
        setBackgroundImageSrc(data.backgroundImageSrc);
        setQrCodeSrc(data.qrCodeSrc);
        setShowQr(data.showQr);
        setBannerWidth(data.bannerWidth);
        setBannerHeight(data.bannerHeight);
      }
    } catch (e) {
      console.error("Failed to load saved data:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save until initial load is complete

    const data: SavedData = {
      city,
      eventName,
      tagline,
      date,
      time,
      venue,
      location,
      backgroundImageSrc,
      qrCodeSrc,
      showQr,
      bannerWidth,
      bannerHeight,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  }, [
    isLoaded,
    city,
    eventName,
    tagline,
    date,
    time,
    venue,
    location,
    backgroundImageSrc,
    qrCodeSrc,
    showQr,
    bannerWidth,
    bannerHeight,
  ]);

  // Handlers for background uploads
  function handleBackgroundUploaded(image: ImageOption) {
    setUploadedBackgrounds((prev) => [...prev, image]);
  }

  function handleBackgroundNameChanged(id: string, name: string) {
    setUploadedBackgrounds((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name } : img))
    );
  }

  function handleBackgroundDeleted(id: string) {
    const imageToDelete = uploadedBackgrounds.find((img) => img.id === id);
    setUploadedBackgrounds((prev) => prev.filter((img) => img.id !== id));
    if (imageToDelete?.url === backgroundImageSrc) {
      setBackgroundImageSrc(presetBackgrounds[0]?.url || "");
    }
  }

  // Handlers for QR code uploads
  function handleQRCodeUploaded(image: ImageOption) {
    setUploadedQRCodes((prev) => [...prev, image]);
  }

  function handleQRCodeNameChanged(id: string, name: string) {
    setUploadedQRCodes((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name } : img))
    );
  }

  function handleQRCodeDeleted(id: string) {
    const imageToDelete = uploadedQRCodes.find((img) => img.id === id);
    setUploadedQRCodes((prev) => prev.filter((img) => img.id !== id));
    if (imageToDelete?.url === qrCodeSrc) {
      setQrCodeSrc(presetQRCodes[0]?.url || "");
    }
  }

  const posterProps = {
    city,
    eventName,
    tagline,
    date,
    time,
    venue,
    location,
    backgroundImageSrc,
    qrCodeSrc,
    showQr,
  };

  // Banner uses same fields, just formatted differently
  const bannerDate = `${date} | ${time}`;

  const bannerProps = {
    eventName,
    date: bannerDate,
    location: venue,
    city,
    image: backgroundImageSrc,
    width: bannerWidth,
    height: bannerHeight,
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            AI Breakfast Poster Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and download clean, warm posters and banners for this week's AI
            Breakfast
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("poster")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "poster"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Poster
            </button>
            <button
              onClick={() => setActiveTab("banner")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "banner"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Banner
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Editor Panel */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                {activeTab === "poster" ? "Customize Your Poster" : "Customize Your Banner"}
              </h2>

              {/* Banner-specific controls */}
              {activeTab === "banner" && (
                <div className="space-y-4 pb-4 border-b border-border">
                  {/* Dimensions */}
                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={bannerWidth}
                        onChange={(e) => setBannerWidth(parseInt(e.target.value) || 1080)}
                        className="w-24 text-base"
                        min={200}
                        max={4000}
                      />
                      <span className="text-muted-foreground">x</span>
                      <Input
                        type="number"
                        value={bannerHeight}
                        onChange={(e) => setBannerHeight(parseInt(e.target.value) || 640)}
                        className="w-24 text-base"
                        min={200}
                        max={4000}
                      />
                      <span className="text-muted-foreground text-sm">px</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setBannerWidth(1080); setBannerHeight(640); }}
                      >
                        Huodongxing (1080x640)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setBannerWidth(1200); setBannerHeight(630); }}
                      >
                        OG Image (1200x630)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setBannerWidth(1920); setBannerHeight(1080); }}
                      >
                        HD (1920x1080)
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shared event fields */}
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

                {/* Only show address for poster */}
                {activeTab === "poster" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Address (multiline)</Label>
                    <Textarea
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={
                        "Address line 1\nAddress line 2\n(Optional note)"
                      }
                      className="text-base min-h-[120px]"
                    />
                  </div>
                )}

                <ImagePicker
                  label="Background Image"
                  value={backgroundImageSrc}
                  onChange={setBackgroundImageSrc}
                  presets={presetBackgrounds}
                  uploads={uploadedBackgrounds}
                  onImageUploaded={handleBackgroundUploaded}
                  onImageNameChanged={handleBackgroundNameChanged}
                  onImageDeleted={handleBackgroundDeleted}
                  accept="image/jpeg,image/png,image/webp"
                />

                {/* QR code only for poster */}
                {activeTab === "poster" && (
                  <ImagePicker
                    label="QR Code"
                    value={qrCodeSrc}
                    onChange={setQrCodeSrc}
                    presets={presetQRCodes}
                    uploads={uploadedQRCodes}
                    onImageUploaded={handleQRCodeUploaded}
                    onImageNameChanged={handleQRCodeNameChanged}
                    onImageDeleted={handleQRCodeDeleted}
                    accept="image/png,image/jpeg"
                  />
                )}
              </div>
            </div>

            {/* Download Button */}
            <div className="space-y-3">
              {activeTab === "poster" && (
                <>
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
                </>
              )}
              {activeTab === "banner" && (
                <BannerDownloadButton
                  {...bannerProps}
                  backgroundImageSrc={backgroundImageSrc}
                />
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {activeTab === "poster"
                ? "Downloads as a 1080×1920px PNG image (perfect for phone viewing & WeChat)"
                : `Downloads as a ${bannerWidth}×${bannerHeight}px PNG image`}
            </p>
          </div>

          {/* Preview Panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground text-center lg:text-left">
                Preview
              </h2>
              {activeTab === "poster" ? (
                <PosterPreview {...posterProps} />
              ) : (
                <BannerPreview {...bannerProps} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
