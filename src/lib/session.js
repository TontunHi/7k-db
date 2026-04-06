/**
 * Stateless HMAC-SHA256 signature system for secure sessions
 * This is 100% Edge and Node.js compatible (using Web Crypto API).
 */

const SECRET = process.env.ADMIN_PASSWORD || 'default_session_secret'

/**
 * Generate a cryptographically secure random session ID
 */
export function generateSessionId() {
    return crypto.randomUUID()
}

/**
 * Sign a payload (e.g. sessionId) to create a stateless token
 */
export async function createSignedToken(sessionId) {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(SECRET)
    const key = await crypto.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(sessionId))
    const sigArray = Array.from(new Uint8Array(signature))
    const sigHex = sigArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return `${sessionId}.${sigHex}`
}

/**
 * Verify a signed token and extract the sessionId
 */
export async function verifyToken(token) {
    if (!token || typeof token !== 'string') return null
    
    const [sessionId, providedSig] = token.split('.')
    if (!sessionId || !providedSig) return null

    // Re-sign the sessionId to verify
    const expectedToken = await createSignedToken(sessionId)
    const [, expectedSig] = expectedToken.split('.')
    
    if (providedSig === expectedSig) {
        return sessionId
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
