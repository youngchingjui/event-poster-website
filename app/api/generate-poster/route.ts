import { type NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventName = "NEON NIGHTS",
      tagline = "An Immersive Electronic Music Experience",
      date = "MARCH 15, 2025",
      time = "8:00 PM — 2:00 AM",
      venue = "THE WAREHOUSE",
      location = "Brooklyn, New York",
      ticketInfo = "Early Bird $45 • General $65",
    } = body

    // Build the URL with query params for the poster page
    const baseUrl = request.nextUrl.origin
    const posterUrl = new URL("/poster", baseUrl)
    posterUrl.searchParams.set("eventName", eventName)
    posterUrl.searchParams.set("tagline", tagline)
    posterUrl.searchParams.set("date", date)
    posterUrl.searchParams.set("time", time)
    posterUrl.searchParams.set("venue", venue)
    posterUrl.searchParams.set("location", location)
    posterUrl.searchParams.set("ticketInfo", ticketInfo)

    // Launch headless browser
    const browser = await chromium.launch({
      headless: true,
    })

    const context = await browser.newContext({
      viewport: { width: 1200, height: 2000 },
      deviceScaleFactor: 2, // Higher quality screenshot
    })

    const page = await context.newPage()

    // Navigate to the poster page
    await page.goto(posterUrl.toString(), {
      waitUntil: "networkidle",
    })

    // Wait for the poster element to be visible
    await page.waitForSelector("#event-poster", { state: "visible" })

    // Take a screenshot of just the poster element
    const posterElement = await page.$("#event-poster")

    if (!posterElement) {
      throw new Error("Poster element not found")
    }

    const screenshot = await posterElement.screenshot({
      type: "png",
    })

    await browser.close()

    // Return the image
    return new NextResponse(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="event-poster.png"`,
      },
    })
  } catch (error) {
    console.error("Error generating poster:", error)
    return NextResponse.json({ error: "Failed to generate poster" }, { status: 500 })
  }
}
