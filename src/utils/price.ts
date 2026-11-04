export function parsePrice(value: string): number {
  const normalized = value.replace(/\s/g, '').replace(/[^\d.,-]/g, '');

  if (normalized.length === 0 || !/\d/.test(normalized)) {
    throw new Error(`Cannot parse price from "${value}".`);
  }

  const lastComma = normalized.lastIndexOf(',');
  const lastDot = normalized.lastIndexOf('.');
  let canonical: string;

  if (lastComma >= 0 && lastDot >= 0) {
    canonical =
      lastComma > lastDot
        ? normalized.replace(/\./g, '').replace(',', '.')
        : normalized.replace(/,/g, '');
  } else if (lastComma >= 0) {
    const decimals = normalized.length - lastComma - 1;
    canonical = decimals === 2 ? normalized.replace(',', '.') : normalized.replace(/,/g, '');
  } else {
    canonical = normalized;
  }

  const parsed = Number(canonical);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Cannot parse price from "${value}".`);
  }

  return parsed;
}
