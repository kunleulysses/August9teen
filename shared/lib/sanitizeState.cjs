/**
 * Sanitizes an object recursively to prevent sensitive data from being exposed.
 *
 * This utility is designed to strip fields that might contain sensitive information,
 * such as PII, long strings, or internal reflections, before sending data to clients.
 *
 * This implementation was created as part of the SEC2 task.
 * @see FlappyJournal/Sprints2/Sprint-2_Performance-and-Protection/04_Task_SEC2_Sanitise_State.md
 */
function sanitizeState(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeState(item));
    }

    const sanitizedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === 'reflection' || key === 'content' || key === 'insights') {
                // Skip sensitive fields
                continue;
            }

            const value = obj[key];
            if (typeof value === 'string' && value.length > 256) {
                sanitizedObj[key] = value.substring(0, 256) + '... [truncated]';
            } else {
                sanitizedObj[key] = sanitizeState(value);
            }
        }
    }

    return sanitizedObj;
}

module.exports = { sanitizeState };