# Technical Architecture

## Hosting

**Platform:** Vercel (serverless)

This means:

- No persistent filesystem - can't read/write files on the server
- Functions spin up on demand - fast cold starts matter
- Edge network - images served globally via CDN

## Image Storage

**Service:** Vercel Blob

User-uploaded images (backgrounds, QR codes) go to Vercel Blob because:

- Native Vercel integration, no extra setup
- Persistent storage - images survive deployments
- CDN-backed - fast loads worldwide
- Simple API - upload returns a URL

**What gets stored:**

- User-uploaded background images
- User-uploaded QR codes
- AI-generated images (if we add that feature)

**What doesn't get stored:**

- Unsplash images - fetched on demand via their API
- Generated posters - regenerated each time (fast enough with @vercel/og)

## Poster Generation

**Library:** @vercel/og (built on Satori)

Generates PNG images from JSX without a browser. This works on Vercel serverless where Playwright/Chromium won't run.

Constraints:

- Flexbox only (no CSS grid, limited positioning)
- Subset of CSS properties
- Images must be fetched via URL, not filesystem

## Data Persistence

**Event details:** localStorage for now, database later when we need multi-device sync

**User accounts:** None yet. Add when we need cloud sync or usage limits.

## API Routes

- `POST /api/upload` - Upload image to Vercel Blob, return URL
- `GET /api/og-poster` - Generate poster image from query params
- Future: `/api/agent` - LLM agent for natural language input

## Environment Variables

```
BLOB_READ_WRITE_TOKEN - Vercel Blob access
UNSPLASH_ACCESS_KEY - For image search (future)
ANTHROPIC_API_KEY - For LLM agent (future)
```
