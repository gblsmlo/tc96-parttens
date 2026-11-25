import type { Navbar11Labels } from './types'

export const defaultNavbar11Labels: Navbar11Labels = {
  account: 'Menu da conta',
  sectionNavigation: 'Seções do sistema de design',
  sourceGroup: 'Fonte de sincronização',
  sourceTrigger: (source) => `Fonte de sincronização: ${source}`,
}
