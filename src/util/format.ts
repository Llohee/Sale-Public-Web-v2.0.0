export function costFormat(
  amount: number | null | undefined | string,
  locale?: string,
  currency?: string,
  option?: { shortCostFormat?: boolean },
): string {
  const normalizedCurrency = currency?.trim().toUpperCase();
  const currencyCode =
    normalizedCurrency && normalizedCurrency.length === 3
      ? normalizedCurrency
      : "VND";
  const shortCostFormatType = option?.shortCostFormat ?? false;
  const value = Number(amount ?? 0);
  const shortView = shortCostFormatType && value >= 1000;

  try {
    return new Intl.NumberFormat(locale ?? "vi-VN", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencySign: "accounting",
      notation: shortView ? "compact" : "standard",
      compactDisplay: shortView ? "short" : "long",
    }).format(value);
  } catch {
    return new Intl.NumberFormat(locale ?? "vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: shortView ? "compact" : "standard",
      compactDisplay: shortView ? "short" : "long",
    }).format(value);
  }
}
