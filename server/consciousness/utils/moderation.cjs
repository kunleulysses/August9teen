const PROFANITY = new Set([
  'fuck','shit','bitch','cunt','asshole','motherfucker','nigger','faggot','retard','rape','kill yourself'
]);

function clean(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function moderateAction(text) {
  const original = clean(text);
  if (!original) return { ok: false, reason: 'empty', cleaned: '' };
  if (original.length > 200) return { ok: false, reason: 'too_long', cleaned: original.slice(0, 200) };
  const lower = original.toLowerCase();
  for (const bad of PROFANITY) {
    if (lower.includes(bad)) return { ok: false, reason: 'profanity', cleaned: original.replace(new RegExp(bad, 'ig'), '***') };
  }
  return { ok: true, cleaned: original };
}

module.exports = { moderateAction };

