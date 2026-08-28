export function fmt(n: number | undefined | null) {
  return Number(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}
