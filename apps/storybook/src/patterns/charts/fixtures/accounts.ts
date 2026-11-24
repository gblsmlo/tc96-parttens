export type AccountSegment = 'Enterprise' | 'Mid-market' | 'SMB'

export interface Account {
  id: string
  name: string
  segment: AccountSegment
  monthlyRevenue: number
  retention: number
  seats: number
}

export const accounts: readonly Account[] = [
  {
    id: 'acme',
    name: 'Acme Corp',
    segment: 'Enterprise',
    monthlyRevenue: 48_000,
    retention: 0.96,
    seats: 1_200,
  },
  {
    id: 'globex',
    name: 'Globex',
    segment: 'Enterprise',
    monthlyRevenue: 36_500,
    retention: 0.91,
    seats: 860,
  },
  {
    id: 'initech',
    name: 'Initech',
    segment: 'Enterprise',
    monthlyRevenue: 29_000,
    retention: 0.88,
    seats: 640,
  },
  {
    id: 'umbrella',
    name: 'Umbrella',
    segment: 'Mid-market',
    monthlyRevenue: 14_200,
    retention: 0.84,
    seats: 210,
  },
  {
    id: 'hooli',
    name: 'Hooli',
    segment: 'Mid-market',
    monthlyRevenue: 11_800,
    retention: 0.9,
    seats: 180,
  },
  {
    id: 'stark',
    name: 'Stark Supply',
    segment: 'Mid-market',
    monthlyRevenue: 9_600,
    retention: 0.77,
    seats: 150,
  },
  {
    id: 'wayne',
    name: 'Wayne Labs',
    segment: 'Mid-market',
    monthlyRevenue: 7_900,
    retention: 0.81,
    seats: 120,
  },
  {
    id: 'pied',
    name: 'Pied Piper',
    segment: 'SMB',
    monthlyRevenue: 2_400,
    retention: 0.72,
    seats: 24,
  },
  {
    id: 'vandelay',
    name: 'Vandelay',
    segment: 'SMB',
    monthlyRevenue: 1_900,
    retention: 0.68,
    seats: 18,
  },
  {
    id: 'bluth',
    name: 'Bluth Co',
    segment: 'SMB',
    monthlyRevenue: 3_100,
    retention: 0.79,
    seats: 32,
  },
  {
    id: 'dunder',
    name: 'Dunder Paper',
    segment: 'SMB',
    monthlyRevenue: 1_200,
    retention: 0.61,
    seats: 9,
  },
]
