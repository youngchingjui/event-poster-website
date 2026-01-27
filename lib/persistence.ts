export type PosterFormData = {
  city: string
  eventName: string
  tagline: string
  date: string
  time: string
  venue: string
  location: string
  backgroundImageSrc: string
  qrCodeSrc: string
  showQr: boolean
}

export type StoredForm = {
  data: PosterFormData
  lastUpdated: string // ISO string
}

const STORAGE_KEY = "posterFormData.v1"
const PREV_KEY = "posterFormData.prev.v1"

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota or JSON errors
  }
}

export function getCurrentStored(): StoredForm | null {
  return read<StoredForm>(STORAGE_KEY)
}

export function getPreviousStored(): StoredForm | null {
  return read<StoredForm>(PREV_KEY)
}

export function saveFormData(data: PosterFormData) {
  const current = getCurrentStored()
  if (current) {
    // move current to previous before overwriting
    write(PREV_KEY, current)
  }
  const toStore: StoredForm = { data, lastUpdated: new Date().toISOString() }
  write(STORAGE_KEY, toStore)
}

export function clearStored() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(PREV_KEY)
  } catch {
    // ignore
  }
}

