// Preserve dialing notation, including optional domestic prefixes such as (0).
// This is formatting validation, not country-specific parsing or reachability.
function normalizeLeadPhone(value) {
  return typeof value === 'string' ? value.trim() : value;
}
function isValidLeadPhone(value) {
  if (typeof value !== 'string' || value.length > 40 || !/^\+?[0-9][0-9 ().-]*$/.test(value.trim())) return false;
  return /^\+?[0-9]{7,15}$/.test(value.trim().replace(/[ ().-]/g, ''));
}
function buildLeadKeyword(keyword, aiSource) {
  const suffix = aiSource ? `ai:${aiSource}` : '';
  const text = (keyword || '').trim();
  if (!suffix) return text.slice(0, 200) || undefined;
  const prefix = text.slice(0, Math.max(0, 200 - suffix.length - 1));
  return prefix ? `${prefix}|${suffix}` : suffix;
}
module.exports = { normalizeLeadPhone, isValidLeadPhone, buildLeadKeyword };
