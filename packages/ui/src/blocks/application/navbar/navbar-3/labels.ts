import type { Navbar3Labels } from './types'

export const defaultNavbar3Labels: Navbar3Labels = {
  account: 'Conta',
  notifications: 'Notificações',
  notificationsEmpty: 'Nenhuma notificação por enquanto.',
  notificationsTrigger: (unread) =>
    unread ? `Notificações, ${unread} não lidas` : 'Notificações',
  search: 'Buscar',
  searchClose: 'Fechar',
  searchEmpty: 'Nenhum resultado encontrado.',
  searchNavigate: 'Navegar',
  searchOpen: 'Abrir',
  searchPlaceholder: 'Buscar páginas e ações',
  unread: 'não lida',
}
