import type { Navbar8Labels } from './types'

export const defaultNavbar8Labels: Navbar8Labels = {
  account: 'Conta',
  categories: 'Categorias de agentes',
  deploy: 'Implantar',
  notifications: 'Notificações',
  notificationsEmpty: 'Nenhuma notificação por enquanto.',
  notificationsTrigger: (unread) => {
    if (unread === 0) return 'Notificações'
    return `Notificações, ${unread} ${unread === 1 ? 'não lida' : 'não lidas'}`
  },
  unread: 'não lida',
}
