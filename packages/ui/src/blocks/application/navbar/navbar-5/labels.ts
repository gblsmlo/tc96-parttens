import type { Navbar5Labels } from './types'

export const defaultNavbar5Labels: Navbar5Labels = {
  breadcrumb: 'Caminho da página',
  overflow: (count) => `Mais ${count} pessoas`,
  people: 'Pessoas nesta página',
  publish: 'Publicar',
  publishActions: 'Mais opções de publicação',
  status: {
    changed: 'Alterações não publicadas',
    draft: 'Rascunho',
    published: 'Publicado',
  },
}
