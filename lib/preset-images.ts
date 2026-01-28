// Preset images available to all users
// These are stored in Vercel Blob and publicly accessible

const BLOB_BASE_URL = process.env.NEXT_PUBLIC_BLOB_BASE_URL || "";

export interface PresetImage {
  id: string;
  name: string;
  url: string;
  thumbnail?: string; // Could be a smaller version, for now same as url
}

export const presetBackgrounds: PresetImage[] = [
  {
    id: "breakfast-table",
    name: "Breakfast Table",
    url: `${BLOB_BASE_URL}/luisa-fournier-hMjyyBqCRIs-unsplash.jpg`,
  },
  // Add more preset backgrounds here as needed
];

export const presetQRCodes: PresetImage[] = [
  {
    id: "qr-30",
    name: "QR #30",
    url: `${BLOB_BASE_URL}/30.png`,
  },
];

// Helper to get display name from URL (for user uploads)
export function getImageDisplayName(url: string): string {
  if (!url) return "";

  // Check if it's a preset
  const preset = [...presetBackgrounds, ...presetQRCodes].find(
    (p) => p.url === url
  );
  if (preset) return preset.name;

  // For uploaded files, extract filename from URL
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Remove random suffix that Vercel Blob adds (e.g., "image-abc123.png" -> "image.png")
    const filename = pathname.split("/").pop() || "Uploaded image";
    return filename;
  } catch {
    return "Custom image";
  }
}
