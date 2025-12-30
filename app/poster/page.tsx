import { EventPoster } from "@/components/event-poster"

function parseBooleanSearchParam(value: string | undefined, defaultValue: boolean) {
  if (value == null) return defaultValue
  const v = value.trim().toLowerCase()
  if (v === "1" || v === "true" || v === "yes" || v === "y" || v === "on") return true
  if (v === "0" || v === "false" || v === "no" || v === "n" || v === "off") return false
  return defaultValue
}

export default async function PosterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <EventPoster
        city={params.city}
        eventName={params.eventName}
        tagline={params.tagline}
        date={params.date}
        time={params.time}
        venue={params.venue}
        location={params.location}
        qrCodeSrc={params.qrCodeSrc}
        showQr={parseBooleanSearchParam(params.showQr, true)}
        backgroundImageSrc={params.backgroundImageSrc}
      />
    </div>
  )
}
