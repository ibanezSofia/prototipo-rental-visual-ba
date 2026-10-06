const USERS_KEY = "rv_admin_users"
const SESSION_KEY = "rv_admin_session"

export type Session = { email: string; at: number }

type StoredUser = { email: string; passHash: string }

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]")
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function setSession(email: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now() }))
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null")
  } catch {
    return null
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}

export async function registerUser(
  email: string,
  password: string,
): Promise<{ ok: true; error?: never } | { ok: false; error: string }> {
  const normalized = normalizeEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, error: "Ingresá un mail válido." }
  }
  if (password.length < 6) {
    return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." }
  }
  const users = readUsers()
  if (users.some((u) => u.email === normalized)) {
    return {
      ok: false,
      error: "Ya existe una cuenta con ese mail. Ingresá en su lugar.",
    }
  }
  users.push({ email: normalized, passHash: await sha256(password) })
  writeUsers(users)
  setSession(normalized)
  return { ok: true }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: true; error?: never } | { ok: false; error: string }> {
  const normalized = normalizeEmail(email)
  const users = readUsers()
  const user = users.find((u) => u.email === normalized)
  if (!user) {
    return {
      ok: false,
      error: "No existe una cuenta con ese mail. Creá una cuenta.",
    }
  }
  const passHash = await sha256(password)
  if (passHash !== user.passHash) {
    return { ok: false, error: "Contraseña incorrecta." }
  }
  setSession(normalized)
  return { ok: true }
}