import type {
  Stats6Period,
  Stats6Sleeve,
} from '@tc96/blocks/application/stats/stats-6'

export const sleevesByPeriod: Record<Stats6Period, Stats6Sleeve[]> = {
  day: [
    {
      amount: 482000,
      delta: 0.004,
      id: 'fixed',
      name: 'Renda fixa',
      share: 0.48,
    },
    {
      amount: 301000,
      delta: -0.012,
      id: 'equities',
      name: 'Ações',
      share: 0.3,
    },
    { amount: 221000, delta: 0.001, id: 'cash', name: 'Caixa', share: 0.22 },
  ],
  month: [
    {
      amount: 471000,
      delta: 0.021,
      id: 'fixed',
      name: 'Renda fixa',
      share: 0.47,
    },
    {
      amount: 318000,
      delta: 0.054,
      id: 'equities',
      name: 'Ações',
      share: 0.32,
    },
    { amount: 215000, delta: 0.009, id: 'cash', name: 'Caixa', share: 0.21 },
  ],
  week: [
    {
      amount: 478000,
      delta: 0.008,
      id: 'fixed',
      name: 'Renda fixa',
      share: 0.48,
    },
    {
      amount: 306000,
      delta: -0.019,
      id: 'equities',
      name: 'Ações',
      share: 0.31,
    },
    { amount: 219000, delta: 0.003, id: 'cash', name: 'Caixa', share: 0.21 },
  ],
  year: [
    {
      amount: 455000,
      delta: 0.112,
      id: 'fixed',
      name: 'Renda fixa',
      share: 0.45,
    },
    {
      amount: 340000,
      delta: 0.186,
      id: 'equities',
      name: 'Ações',
      share: 0.34,
    },
    { amount: 208000, delta: 0.097, id: 'cash', name: 'Caixa', share: 0.21 },
  ],
}

export const sleeves = sleevesByPeriod.month
