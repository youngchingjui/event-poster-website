import { type NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      city = "Shanghai",
      eventName = "AI Breakfast #21",
      tagline = "AI workflows • 2025 reflections • 2026 predictions",
      date = "Thursday, Jan 1",
      time = "9:00 – 10:30 AM",
      venue = "BAKER&SPICE",
      location = "1717 West Nanjing Road, Wheelock Square\n南京西路1717号 会德丰国际广场南院首层101号商铺\n(Look for long table in the back)",
      qrCodeSrc,
      showQr = true,
      backgroundImageSrc,
    } = body

    // Build the URL with query params for the poster page
    const baseUrl = request.nextUrl.origin
    const posterUrl = new URL("/poster", baseUrl)
    posterUrl.searchParams.set("city", city)
    posterUrl.searchParams.set("eventName", eventName)
    posterUrl.searchParams.set("tagline", tagline)
    posterUrl.searchParams.set("date", date)
    posterUrl.searchParams.set("time", time)
    posterUrl.searchParams.set("venue", venue)
    posterUrl.searchParams.set("location", location)
    // Preserve explicit "empty string" so the poster can render a placeholder (reserve space)
    if (qrCodeSrc != null) posterUrl.searchParams.set("qrCodeSrc", qrCodeSrc)
    if (!showQr) posterUrl.searchParams.set("showQr", "0")
    if (backgroundImageSrc) posterUrl.searchParams.set("backgroundImageSrc", backgroundImageSrc)

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

    // Ensure images inside the poster have finished loading before screenshotting
    await page
      .waitForFunction(() => {
        const poster = document.querySelector("#event-poster")
        if (!poster) return false
        const imgs = Array.from(poster.querySelectorAll("img"))
        return imgs.every((img) => img.complete && img.naturalWidth > 0)
      })
      .catch(() => {
        // If an image fails to load, we still want to return *something* rather than erroring.
      })

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
