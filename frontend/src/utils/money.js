/** Format amounts in Moroccan Dirham (MAD). */
export function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} MAD`
}
