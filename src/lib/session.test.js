import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSignedToken, validateSession, verifyToken } from './session'

describe('session tokens', () => {
    beforeEach(() => {
        process.env.SESSION_SECRET = 'test-secret-at-least-long-enough'
        vi.useRealTimers()
    })

    it('verifies a valid token and returns the signed subject', async () => {
        const token = await createSignedToken('42', 60)

        await expect(verifyToken(token)).resolves.toBe('42')
        await expect(validateSession(token)).resolves.toBe(true)
    })

    it('rejects tampered tokens', async () => {
        const token = await createSignedToken('42', 60)
        const [payload, signature] = token.split('.')
        const tamperedToken = `${payload}.${signature.slice(0, -1)}${signature.endsWith('0') ? '1' : '0'}`

        await expect(verifyToken(tamperedToken)).resolves.toBeNull()
        await expect(validateSession(tamperedToken)).resolves.toBe(false)
    })

    it('rejects expired tokens', async () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-04-27T00:00:00.000Z'))
        const token = await createSignedToken('42', 1)

        vi.setSystemTime(new Date('2026-04-27T00:00:02.000Z'))

        await expect(verifyToken(token)).resolves.toBeNull()
    })
})
