const B3_SUFFIX = '.SA';

export function normalizeStockSymbol(symbol: string): string {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return normalizedSymbol.endsWith(B3_SUFFIX)
    ? normalizedSymbol
    : `${normalizedSymbol}${B3_SUFFIX}`;
}

export function getStockHref(symbol: string): string {
  const routeSymbol = normalizeStockSymbol(symbol).slice(0, -B3_SUFFIX.length);

  return `/stock/${encodeURIComponent(routeSymbol)}`;
}
