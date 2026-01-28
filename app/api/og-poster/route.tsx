import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

// Use edge runtime for best performance on Vercel
export const runtime = "edge"

// Helper to fetch image and convert to base64 data URL
async function fetchImageAsDataUrl(imagePath: string, baseUrl: string): Promise<string | null> {
  try {
    // Build full URL: if it's a relative path, prepend base URL
    // If it's already an absolute URL (e.g., Vercel Blob), use as-is
    const imageUrl = imagePath.startsWith("http")
      ? imagePath
      : new URL(imagePath, baseUrl).href

    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.error(`Failed to fetch image ${imageUrl}: ${response.status}`)
      return null
    }

    const contentType = response.headers.get("content-type") || "image/jpeg"
    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error(`Failed to fetch image ${imagePath}:`, error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Get poster parameters
  const city = searchParams.get("city") || "Shanghai"
  const eventName = searchParams.get("eventName") || "AI Breakfast #21"
  const tagline = searchParams.get("tagline") || "AI workflows • 2025 reflections • 2026 predictions"
  const date = searchParams.get("date") || "Thursday, Jan 1"
  const time = searchParams.get("time") || "9:00 – 10:30 AM"
  const venue = searchParams.get("venue") || "BAKER&SPICE"
  const location =
    searchParams.get("location") ||
    "1717 West Nanjing Road, Wheelock Square\n南京西路1717号 会德丰国际广场南院首层101号商铺\n(Look for long table in the back)"
  const blobBaseUrl = process.env.NEXT_PUBLIC_BLOB_BASE_URL || ""
  const backgroundImageSrc =
    searchParams.get("backgroundImageSrc") || `${blobBaseUrl}/luisa-fournier-hMjyyBqCRIs-unsplash.jpg`
  const qrCodeSrc = searchParams.get("qrCodeSrc") || `${blobBaseUrl}/23.png`
  const showQr = searchParams.get("showQr") !== "false"

  const locationLines = location.split("\n").filter(Boolean)

  // Poster dimensions (optimized for phone viewing - vertical format)
  const width = 1080
  const height = 1920

  // Get base URL for fetching local images
  const baseUrl = new URL(request.url).origin

  // Fetch images via URL (works on Vercel serverless)
  const [backgroundImageDataUrl, qrCodeDataUrl, serifFontData] = await Promise.all([
    fetchImageAsDataUrl(backgroundImageSrc, baseUrl),
    showQr ? fetchImageAsDataUrl(qrCodeSrc, baseUrl) : Promise.resolve(null),
    // Load Source Serif Pro for better serif rendering
    fetch("https://cdn.jsdelivr.net/fontsource/fonts/source-serif-pro@latest/latin-400-normal.ttf")
      .then((res) => (res.ok ? res.arrayBuffer() : undefined))
      .catch(() => undefined),
  ])

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F6EBDC",
            position: "relative",
          }}
        >
          {/* Background image at bottom */}
          {backgroundImageDataUrl && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "980px",
                display: "flex",
              }}
            >
              <img
                src={backgroundImageDataUrl}
                width={1080}
                height={980}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              background:
                "linear-gradient(to bottom, rgba(246,235,220,1) 0%, rgba(246,235,220,1) 46%, rgba(246,235,220,0.65) 62%, rgba(246,235,220,0) 78%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "80px",
              position: "relative",
            }}
          >
            {/* City */}
            <p
              style={{
                fontSize: "34px",
                color: "#6F6257",
                fontFamily: "Source Serif Pro, Georgia, serif",
                letterSpacing: "0.05em",
              }}
            >
              {city}
            </p>

            {/* Event name - keep on one line */}
            <h1
              style={{
                marginTop: "24px",
                fontSize: "115px",
                lineHeight: 0.95,
                color: "#C65B3C",
                fontFamily: "Source Serif Pro, Georgia, serif",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {eventName}
            </h1>

            {/* Date and time */}
            <p
              style={{
                marginTop: "40px",
                fontSize: "54px",
                lineHeight: 1.2,
                color: "#6F6257",
                fontFamily: "Source Serif Pro, Georgia, serif",
              }}
            >
              {date} | {time}
            </p>

            {/* Tagline */}
            <p
              style={{
                marginTop: "24px",
                fontSize: "34px",
                lineHeight: 1.6,
                color: "#7A6B5E",
                fontFamily: "Source Serif Pro, Georgia, serif",
                maxWidth: "880px",
              }}
            >
              {tagline}
            </p>

            {/* Venue and location */}
            <div
              style={{
                marginTop: "48px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "34px",
                  color: "#6F6257",
                  fontFamily: "Source Serif Pro, Georgia, serif",
                  letterSpacing: "0.05em",
                }}
              >
                {venue}
              </p>
              {locationLines.map((line, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: "30px",
                    lineHeight: 1.4,
                    color: "#7A6B5E",
                    fontFamily: "Source Serif Pro, Georgia, serif",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* QR code area */}
          {showQr && (
            <div
              style={{
                position: "absolute",
                right: "80px",
                bottom: "80px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  width: "360px",
                  height: "360px",
                  backgroundColor: "white",
                  border: "6px solid #7B8B76",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                }}
              >
                {qrCodeDataUrl && (
                  <img
                    src={qrCodeDataUrl}
                    width={312}
                    height={312}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "22px",
                  color: "#6F6257",
                  fontFamily: "Source Serif Pro, Georgia, serif",
                }}
              >
                Scan to register
              </p>
            </div>
          )}
        </div>
      ),
      {
        width,
        height,
        fonts: serifFontData
          ? [
              {
                name: "Source Serif Pro",
                data: serifFontData,
                style: "normal" as const,
                weight: 400,
              },
            ]
          : undefined,
      }
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response(`Failed to generate image: ${error}`, { status: 500 })
  }
}
