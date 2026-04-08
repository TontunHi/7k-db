/**
 * Stateless HMAC-SHA256 signature system for secure sessions
 * This is 100% Edge and Node.js compatible (using Web Crypto API).
 */

const SECRET = process.env.SESSION_SECRET

function getSecret() {
    if (!SECRET) {
        // Only throw if we are in production and NOT in a build phase
        // During build, we allow a fallback to prevent Next.js from crashing
        if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE?.includes('build')) {
            throw new Error("\x1b[31m[SECURITY FATAL] SESSION_SECRET is missing from environment variables!\x1b[0m")
        }
        return 'build-time-fallback-secret'
    }
    return SECRET
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
export async function createSignedToken(payload) {
    const encoder = new TextEncoder()
    const currentSecret = getSecret()
    const keyData = encoder.encode(currentSecret)
    const key = await crypto.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const sigArray = Array.from(new Uint8Array(signature))
    const sigHex = sigArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return `${payload}.${sigHex}`
}

/**
 * Verify a signed token and extract the payload
 */
export async function verifyToken(token) {
    if (!token || typeof token !== 'string') return null
    
    const [payload, providedSig] = token.split('.')
    if (!payload || !providedSig) return null

    // Re-sign the payload to verify
    const expectedToken = await createSignedToken(payload)
    const [, expectedSig] = expectedToken.split('.')
    
    if (providedSig === expectedSig) {
        return payload
    }
    
    return null
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
