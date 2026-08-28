/**
 * Local persistence for the front-end-only phase of the MVP.
 * Same shape (get/set/list by prefix) as the Supabase-backed store this
 * will become once the backend phase starts — call sites don't change.
 */

const NS = 'elo:';

function fullKey(key: string) {
  return NS + key;
}

export async function storageGet(key: string): Promise<string | null> {
  try {
    return window.localStorage.getItem(fullKey(key));
  } catch {
    return null;
  }
}

export async function storageSet(key: string, value: string): Promise<boolean> {
  try {
    window.localStorage.setItem(fullKey(key), value);
    return true;
  } catch {
    return false;
  }
}

export async function storageList(prefix: string): Promise<string[]> {
  try {
    const out: string[] = [];
    const full = fullKey(prefix);
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(full)) out.push(k.slice(NS.length));
    }
    return out;
  } catch {
    return [];
  }
}

export async function getAllRecords<T>(prefix: string): Promise<{ key: string; data: T }[]> {
  const keys = await storageList(prefix);
  const out: { key: string; data: T }[] = [];
  for (const key of keys) {
    const raw = await storageGet(key);
    if (!raw) continue;
    try {
      out.push({ key, data: JSON.parse(raw) as T });
    } catch {
      // skip malformed records
    }
  }
  return out;
}

export function slug(email: string) {
  return String(email).trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '');
}

export const EMP_PREFIX = 'empresa:';
export const ENT_PREFIX = 'entidade:';

export type Entidade = {
  nome: string;
  tipo: string;
  cidade: string;
  uf: string;
  responsavel: string;
  email: string;
  senha: string;
};

export type Empresa = {
  nome: string;
  setor: string;
  cidade: string;
  uf: string;
  responsavel: string;
  email: string;
  senha: string;
  kgDoado: number;
  doacoes: number;
};
