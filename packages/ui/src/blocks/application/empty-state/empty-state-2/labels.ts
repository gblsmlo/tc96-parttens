import type { EmptyState2Labels } from './types'

export const defaultEmptyState2Labels: EmptyState2Labels = {
  clear: 'Limpar busca',
  description: 'Confira a ortografia ou tente termos mais curtos e gerais.',
  suggestions: 'Tente buscar por',
  title: (query) => `Nenhum resultado para “${query}”`,
}
