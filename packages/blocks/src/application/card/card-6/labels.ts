import type { Card6Labels } from './types'

export const defaultCard6Labels: Card6Labels = {
  apply: 'Candidatar-se',
  applyTo: (title, company) => `Candidatar-se a ${title} em ${company}`,
  emptyDescription: 'As vagas recomendadas para você aparecem aqui.',
  emptyTitle: 'Nenhuma vaga recomendada',
  salary: (min, max) => `${min} a ${max}`,
  save: (title) => `Salvar vaga ${title}`,
  title: 'Vagas recomendadas',
  unsave: (title) => `Remover ${title} das vagas salvas`,
  workModes: { hybrid: 'Híbrido', onsite: 'Presencial', remote: 'Remoto' },
}
