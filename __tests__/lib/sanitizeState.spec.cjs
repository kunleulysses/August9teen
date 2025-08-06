const { sanitizeState } = require('../../shared/lib/sanitizeState.cjs');

describe('sanitizeState', () => {
    it('should return non-object values as is', () => {
        expect(sanitizeState(null)).toBeNull();
        expect(sanitizeState(undefined)).toBeUndefined();
        expect(sanitizeState(123)).toBe(123);
        expect(sanitizeState('hello')).toBe('hello');
        expect(sanitizeState(true)).toBe(true);
    });

    it('should recursively sanitize an object', () => {
        const obj = {
            a: 1,
            b: {
                c: 'hello',
                reflection: 'sensitive data',
                d: {
                    e: 'world',
                    content: 'more sensitive data'
                }
            },
            f: [1, { g: 'safe', reflection: 'sensitive' }]
        };
        const sanitized = sanitizeState(obj);
        expect(sanitized).toEqual({
            a: 1,
            b: {
                c: 'hello',
                d: {
                    e: 'world'
                }
            },
            f: [1, { g: 'safe' }]
        });
    });

    it('should truncate long strings', () => {
        const longString = 'a'.repeat(300);
        const obj = {
            a: longString,
            b: {
                c: longString
            }
        };
        const sanitized = sanitizeState(obj);
        const truncatedString = 'a'.repeat(256) + '... [truncated]';
        expect(sanitized.a).toBe(truncatedString);
        expect(sanitized.b.c).toBe(truncatedString);
    });

    it('should handle arrays correctly', () => {
        const arr = [
            { a: 1, reflection: 'sensitive' },
            { b: 2, content: 'sensitive' },
            { c: 3 }
        ];
        const sanitized = sanitizeState(arr);
        expect(sanitized).toEqual([
            { a: 1 },
            { b: 2 },
            { c: 3 }
        ]);
    });

    it('should handle nested arrays', () => {
        const arr = [
            [
                { a: 1, reflection: 'sensitive' }
            ]
        ];
        const sanitized = sanitizeState(arr);
        expect(sanitized).toEqual([
            [
                { a: 1 }
            ]
        ]);
    });

    it('should not modify the original object', () => {
        const obj = {
            a: 1,
            reflection: 'sensitive'
        };
        sanitizeState(obj);
        expect(obj).toEqual({
            a: 1,
            reflection: 'sensitive'
        });
    });
});