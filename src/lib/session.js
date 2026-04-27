/**
 * Stateless HMAC-SHA256 signature system for secure sessions
 * This is 100% Edge and Node.js compatible (using Web Crypto API).
 */

const DEFAULT_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24

function getSecret() {
    const secret = process.env.SESSION_SECRET
    if (!secret) {
        // Only throw if we are in production and NOT in a build phase
        // During build, we allow a fallback to prevent Next.js from crashing
        if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE?.includes('build')) {
            throw new Error("\x1b[31m[SECURITY FATAL] SESSION_SECRET is missing from environment variables!\x1b[0m")
        }
        return 'build-time-fallback-secret'
    }
    return secret
}

function encodeBase64Url(value) {
    const bytes = new TextEncoder().encode(value)
    const binary = String.fromCharCode(...bytes)
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function decodeBase64Url(value) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}

function constantTimeEqual(left, right) {
    if (typeof left !== 'string' || typeof right !== 'string') return false
    const leftBytes = new TextEncoder().encode(left)
    const rightBytes = new TextEncoder().encode(right)
    let diff = leftBytes.length ^ rightBytes.length
    const length = Math.max(leftBytes.length, rightBytes.length)

    for (let i = 0; i < length; i++) {
        diff |= (leftBytes[i] || 0) ^ (rightBytes[i] || 0)
    }

    return diff === 0
}

async function signPayload(payload) {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(getSecret())
    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const sigArray = Array.from(new Uint8Array(signature))
    return sigArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a cryptographically secure random session ID
 */
export function generateSessionId() {
    return crypto.randomUUID()
}

/**
 * Sign a payload (e.g. userId or sessionId) to create a stateless token
 */
export async function createSignedToken(payload, maxAgeSeconds = DEFAULT_SESSION_MAX_AGE_SECONDS) {
    const now = Math.floor(Date.now() / 1000)
    const tokenPayload = encodeBase64Url(JSON.stringify({
        sub: String(payload),
        iat: now,
        exp: now + maxAgeSeconds,
    }))
    const sigHex = await signPayload(tokenPayload)

    return `${tokenPayload}.${sigHex}`
}

/**
 * Verify a signed token and extract the payload
 */
export async function verifyToken(token) {
    if (!token || typeof token !== 'string') return null
    
    const parts = token.split('.')
    if (parts.length !== 2) return null

    const [payload, providedSig] = parts
    if (!payload || !providedSig) return null

    const expectedSig = await signPayload(payload)
    if (!constantTimeEqual(providedSig, expectedSig)) {
        return null
    }

    try {
        const parsedPayload = JSON.parse(decodeBase64Url(payload))
        if (!parsedPayload?.sub || !parsedPayload?.exp) return null
        if (Math.floor(Date.now() / 1000) >= parsedPayload.exp) return null
        return parsedPayload.sub
    } catch (error) {
        return null
    }
}

// Backward Compatibility / Simple validation
export async function validateSession(token) {
    const sessionId = await verifyToken(token)
    return !!sessionId
}

/**
 * Backward compatibility helpers (no-op since we are stateless now)
 */
export async function deleteSession(token) { }
export async function cleanupSessions() { }
