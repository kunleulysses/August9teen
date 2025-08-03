/**
 * Sanitize a string to be used as a filesystem slug.
 *  - lower-case
 *  - replace any non [a-z0-9-] with '-'
 *  - collapse multiple dashes
 *  - trim leading/trailing dashes
 *  - if result is empty, use "module"
 *  - truncate to max 50 chars
 */
export function sanitizeSlug(str) {
    if (!str || typeof str !== 'string') return 'module';
    let slug = str
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')   // replace non [a-z0-9-] with '-'
        .replace(/-+/g, '-')            // collapse multiple dashes
        .replace(/^[-]+|[-]+$/g, '');   // trim leading/trailing dashes
    if (!slug) slug = 'module';
    if (slug.length > 50) slug = slug.slice(0, 50);
    return slug;
}