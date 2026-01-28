# Event Poster Website

## What is this?

A tool for quickly generating event posters, especially for recurring events like AI Breakfast Shanghai. See `docs/product.md` for features and `docs/architecture.md` for technical decisions.

## Key Technical Decisions

- **Hosting:** Vercel serverless - no filesystem access in API routes
- **Image storage:** Vercel Blob for user uploads (not local /public folder)
- **Poster generation:** @vercel/og (Satori) - generates images from JSX without a browser
- **Images in API routes:** Must be fetched via URL, not read from filesystem

## Common Tasks

**Generate a poster locally:**

```bash
npm run dev
# Visit http://localhost:3000
# Or call API directly: curl "http://localhost:3000/api/og-poster?eventName=Test" -o poster.png
```

## GitHub

- Use `gh` CLI for GitHub operations (not the MCP plugin - has auth issues)
- `gh issue list` is read-only, always safe to run
- vercel is connected to our github repo, so any changes will automatically run deployment on vercel.
