import type { Navbar9Labels } from './types'

export const defaultNavbar9Labels: Navbar9Labels = {
  branchTrigger: (branch) => `Trocar de branch, atual: ${branch}`,
  defaultBadge: 'Padrão',
  kinds: {
    branch: 'Branches',
    deploy: 'Deploys',
    tag: 'Tags',
  },
  path: 'Caminho do repositório',
  run: 'Executar',
  running: 'Executando…',
  share: 'Compartilhar',
}
