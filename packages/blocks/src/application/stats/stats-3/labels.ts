import type { Stats3Labels } from './types'

export const defaultStats3Labels: Stats3Labels = {
  ratio: (value, total) => `${value} / ${total}`,
  title: 'Capacidade',
}
