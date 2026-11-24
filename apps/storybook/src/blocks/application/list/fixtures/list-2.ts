import type {
  List2Entry,
  List2Range,
} from '@tc96/ui/blocks/application/list/list-2'

export const entriesByRange: Record<List2Range, List2Entry[]> = {
  '7d': [
    { amount: 42000, id: 'marina', name: 'Marina Souza', share: 0.42 },
    { amount: 31000, id: 'rafael', name: 'Rafael Lima', share: 0.31 },
    { amount: 19000, id: 'beatriz', name: 'Beatriz Alves', share: 0.19 },
    { amount: 8000, id: 'tiago', name: 'Tiago Nunes', share: 0.08 },
  ],
  '12m': [
    { amount: 1750000, id: 'beatriz', name: 'Beatriz Alves', share: 0.35 },
    { amount: 1500000, id: 'marina', name: 'Marina Souza', share: 0.3 },
    { amount: 1000000, id: 'rafael', name: 'Rafael Lima', share: 0.2 },
    { amount: 750000, id: 'tiago', name: 'Tiago Nunes', share: 0.15 },
  ],
  '30d': [
    { amount: 168000, id: 'rafael', name: 'Rafael Lima', share: 0.42 },
    { amount: 124000, id: 'marina', name: 'Marina Souza', share: 0.31 },
    { amount: 72000, id: 'beatriz', name: 'Beatriz Alves', share: 0.18 },
    { amount: 36000, id: 'tiago', name: 'Tiago Nunes', share: 0.09 },
  ],
}

export const entries = entriesByRange['30d']
