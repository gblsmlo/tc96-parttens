import type { ShellLabels } from './types'

export const defaultShellLabels: ShellLabels = {
  account: 'Conta',
  breadcrumb: 'Trilha de navegação',
  itemActions: (title) => `Ações de ${title}`,
  markAllRead: 'Marcar todas como lidas',
  navigation: 'Navegação principal',
  notifications: 'Notificações',
  notificationsEmpty: 'Nenhuma notificação.',
  notificationsTrigger: (unread) =>
    unread ? `Notificações, ${unread} não lidas` : 'Notificações',
  projects: 'Projetos',
  search: 'Buscar',
  searchClose: 'Fechar',
  searchEmpty: 'Nenhuma página encontrada.',
  searchNavigate: 'Navegar',
  searchOpen: 'Abrir',
  searchPlaceholder: 'Buscar páginas…',
  sections: 'Seções',
  signOut: 'Sair',
  switchWorkspace: 'Trocar workspace',
  theme: 'Tema',
  themeDark: 'Escuro',
  themeLight: 'Claro',
  themeSystem: 'Sistema',
  toggleSidebar: 'Alternar barra lateral',
  unread: 'Não lida',
  workspaces: 'Workspaces',
}

export function resolveShellLabels(labels?: Partial<ShellLabels>): ShellLabels {
  return { ...defaultShellLabels, ...labels }
}
