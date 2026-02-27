import { checkAccountLock } from '../../services/UserService.js';

describe('checkAccountLock', () => {
    test('returns locked when lockUntil is in the future', () => {
        const user = { lockUntil: new Date(Date.now() + 30 * 60 * 1000) };
        const result = checkAccountLock(user);
        expect(result.locked).toBe(true);
        expect(result.minutesLeft).toBeGreaterThan(0);
    });

    test('returns not locked when lockUntil has passed', () => {
        const user = { lockUntil: new Date(Date.now() - 1000) };
        const result = checkAccountLock(user);
        expect(result.locked).toBe(false);
    });

    test('returns not locked when no lockUntil', () => {
        const user = {};
        const result = checkAccountLock(user);
        expect(result.locked).toBe(false);
    });
});
