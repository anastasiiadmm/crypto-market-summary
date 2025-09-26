import type { ZodType } from 'zod';

export async function safeFetch<T>(url: string, schema: ZodType<T>): Promise<T> {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.warn('Validation failed for', url, parsed.error);
    return json as unknown as T;
  }
  return parsed.data;
}
