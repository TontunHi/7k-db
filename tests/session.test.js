import { test, expect, describe } from 'vitest';
import { createSignedToken, verifyToken } from '../src/lib/session.js';

describe('Session Signature Validation', () => {
    test('verifyToken should successfully verify an untampered token', async () => {
        const payload = 'admin_user_id_1';
        const token = await createSignedToken(payload);
        
        expect(token).toBeDefined();
        
        const verifiedPayload = await verifyToken(token);
        expect(verifiedPayload).toBe(payload);
    });

    test('verifyToken should reject a tampered signature', async () => {
        const payload = 'admin_user_id_1';
        const token = await createSignedToken(payload);
        
        // Tamper with the signature (last character)
        const tamperedToken = token.slice(0, -1) + 'a';
        
        const verifiedPayload = await verifyToken(tamperedToken);
        expect(verifiedPayload).toBeNull();
    });

    test('verifyToken should reject a tampered payload', async () => {
        const originalPayload = 'admin_user_id_1';
        const token = await createSignedToken(originalPayload);
        
        // Tamper with the payload (e.g. elevate privileges by changing payload string)
        const parts = token.split('.');
        const tamperedToken = `admin_user_id_2.${parts[1]}`;
        
        const verifiedPayload = await verifyToken(tamperedToken);
        expect(verifiedPayload).toBeNull();
    });
});
