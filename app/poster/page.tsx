import { EventPoster } from "@/components/event-poster"

export default async function PosterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <EventPoster
        eventName={params.eventName}
        tagline={params.tagline}
        date={params.date}
        time={params.time}
        venue={params.venue}
        location={params.location}
        ticketInfo={params.ticketInfo}
      />
    </div>
  )
}
