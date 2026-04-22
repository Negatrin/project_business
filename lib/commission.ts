/** Platform commission logic — single source of truth */

export const DEFAULT_COMMISSION_RATE = Number(process.env.COMMISSION_RATE ?? 20)

export interface CommissionBreakdown {
  grossAmount: number
  commissionRate: number
  commissionAmount: number
  netAmount: number
}

export function calculateCommission(
  grossAmount: number,
  ratePercent: number = DEFAULT_COMMISSION_RATE,
): CommissionBreakdown {
  const commissionAmount = Math.round((grossAmount * ratePercent) / 100)
  return {
    grossAmount,
    commissionRate: ratePercent,
    commissionAmount,
    netAmount: grossAmount - commissionAmount,
  }
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`
}
