import { Currency } from '../types';

export const USD_TO_INR_RATE = 83.5;
export const INR_EXCHANGE_RATE = USD_TO_INR_RATE;

/**
 * Formats a price in Indian Rupees (₹) with proper Indian numbering system (e.g., ₹1,299 or ₹450)
 */
export function formatRupees(amountInINR: number): string {
  const rounded = Math.round(amountInINR);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Formats price in USD ($)
 */
export function formatUSD(amountInUSD: number): string {
  return `$${amountInUSD.toFixed(2)}`;
}

/**
 * Primary currency formatter that respects active currency setting
 */
export function formatPrice(
  amount: number,
  currency: Currency = 'INR',
  priceInRupees?: number
): string {
  if (currency === 'INR') {
    const inrVal = priceInRupees !== undefined ? priceInRupees : amount * USD_TO_INR_RATE;
    return formatRupees(inrVal);
  }
  return formatUSD(amount);
}

/**
 * Dual price display string, e.g. "₹549 ($18.99)" or "$18.99 (₹549)"
 */
export function getDualPriceDisplay(
  priceInRupees: number,
  priceInUSD: number,
  primaryCurrency: Currency = 'INR'
): { primary: string; secondary: string } {
  if (primaryCurrency === 'INR') {
    return {
      primary: formatRupees(priceInRupees),
      secondary: formatUSD(priceInUSD),
    };
  }
  return {
    primary: formatUSD(priceInUSD),
    secondary: formatRupees(priceInRupees),
  };
}
