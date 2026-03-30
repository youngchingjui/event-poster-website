import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

async function fetchImageAsDataUrl(
  imagePath: string,
  baseUrl: string
): Promise<string | null> {
  try {
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

function ClassicBannerTemplate({
  eventName,
  date,
  location,
  city,
  imageDataUrl,
  width,
}: {
  eventName: string
  date: string
  location: string
  city: string
  imageDataUrl: string | null
  width: number
  height: number
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#FFFAF5",
        position: "relative",
      }}
    >
      {/* Left content */}
      <div
        style={{
          flex: 1,
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Group 1: Header (City + Event Name) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "28px",
          }}
        >
          {/* City label */}
          <span
            style={{
              fontSize: "24px",
              letterSpacing: "0.05em",
              marginBottom: "8px",
              color: "#78716C",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {city}
          </span>

          {/* Event Name */}
          <h1
            style={{
              lineHeight: 0.95,
              color: "#C2410C",
              fontFamily: "Playfair Display, Georgia, serif",
              letterSpacing: "-0.02em",
              fontSize: Math.min(110, width / 10),
              whiteSpace: "nowrap",
            }}
          >
            {eventName}
          </h1>
        </div>

        {/* Group 2: Details (Date + Location) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Date & Time */}
          <p
            style={{
              fontSize: "36px",
              lineHeight: 1.2,
              marginBottom: "12px",
              color: "#78716C",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {date}
          </p>

          {/* Location */}
          <p
            style={{
              fontSize: "24px",
              letterSpacing: "0.05em",
              color: "#78716C",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {location}
          </p>
        </div>
      </div>

      {/* Right image section */}
      <div
        style={{
          width: "40%",
          position: "relative",
          display: "flex",
        }}
      >
        {imageDataUrl && (
          <img
            src={imageDataUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, rgba(255,250,245,1) 0%, rgba(255,250,245,0.65) 30%, rgba(255,250,245,0) 60%)",
            display: "flex",
          }}
        />
      </div>
    </div>
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const eventName = searchParams.get("eventName") || "AI Breakfast"
  const date = searchParams.get("date") || "Thursday, Jan 1 | 9:00 AM"
  const location = searchParams.get("location") || "BAKER&SPICE"
  const city = searchParams.get("city") || "Shanghai"
  const width = parseInt(searchParams.get("width") || "1080", 10)
  const height = parseInt(searchParams.get("height") || "640", 10)

  const blobBaseUrl = process.env.NEXT_PUBLIC_BLOB_BASE_URL || ""
  const backgroundImageSrc =
    searchParams.get("backgroundImageSrc") ||
    `${blobBaseUrl}/luisa-fournier-hMjyyBqCRIs-unsplash.jpg`

  const baseUrl = new URL(request.url).origin

  const [imageDataUrl, displayFontData, sansFontData] = await Promise.all([
    fetchImageAsDataUrl(backgroundImageSrc, baseUrl),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf"
    )
      .then((res) => (res.ok ? res.arrayBuffer() : undefined))
      .catch(() => undefined),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf"
    )
      .then((res) => (res.ok ? res.arrayBuffer() : undefined))
      .catch(() => undefined),
  ])

  try {
    return new ImageResponse(
      (
        <ClassicBannerTemplate
          eventName={eventName}
          date={date}
          location={location}
          city={city}
          imageDataUrl={imageDataUrl}
          width={width}
          height={height}
        />
      ),
      {
        width,
        height,
        fonts: [
          ...(displayFontData
            ? [
                {
                  name: "Playfair Display",
                  data: displayFontData,
                  style: "normal" as const,
                  weight: 700 as const,
                },
              ]
            : []),
          ...(sansFontData
            ? [
                {
                  name: "Inter",
                  data: sansFontData,
                  style: "normal" as const,
                  weight: 400 as const,
                },
              ]
            : []),
        ],
      }
    )
  } catch (error) {
    console.error("Error generating banner image:", error)
    return new Response(`Failed to generate banner: ${error}`, { status: 500 })
  }
}
