const SECRET_KEYS =
  /^(authorization|proxy-authorization|api[_-]?key|x-goog-api-key|access[_-]?token|refresh[_-]?token|password|secret|set-cookie)$/i;

export function collectSecretValues(env: NodeJS.ProcessEnv = process.env): string[] {
  const names = [
    'GEMINI_API_KEY',
    'PERPLEXITY_API_KEY',
    'DOUBAO_API_KEY',
    'ARK_API_KEY',
    'ADMIN_IMAGE_PASSWORD',
  ];
  const values: string[] = [];
  for (const name of names) {
    const value = env[name];
    if (value && value.length >= 8) values.push(value);
  }
  return values;
}

export function redactString(value: string, secrets: string[]): string {
  let out = value;
  for (const secret of secrets) {
    if (secret && out.includes(secret)) out = out.split(secret).join('[REDACTED]');
  }
  return out;
}

export function redactJson(value: unknown, secrets: string[] = []): unknown {
  if (typeof value === 'string') return redactString(value, secrets);
  if (typeof value === 'number' || typeof value === 'boolean' || value == null) return value;
  if (Array.isArray(value)) return value.map((item) => redactJson(item, secrets));
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SECRET_KEYS.test(key) ? '[REDACTED]' : redactJson(nested, secrets);
    }
    return out;
  }
  return null;
}

export function truncateText(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…[truncated]`;
}
