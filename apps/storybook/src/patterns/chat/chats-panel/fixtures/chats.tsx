import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import type { IconModule } from '@thesvg/icons'
import instagram from '@thesvg/icons/instagram'
import messenger from '@thesvg/icons/messenger'
import whatsapp from '@thesvg/icons/whatsapp'

export type Channel = 'instagram' | 'messenger' | 'whatsapp'

export interface ChatSummary {
  channel: Channel
  id: string
  initials: string
  lastMessage: string
  lastMessageAt: string
  name: string
  photo?: string
  time: string
  unreadCount: number
}

export const channels = { instagram, messenger, whatsapp } satisfies Record<
  Channel,
  IconModule
>

export const chats: ChatSummary[] = [
  {
    channel: 'messenger',
    id: 'marina',
    initials: 'MC',
    lastMessage: 'Consegue me mandar a proposta até amanhã?',
    lastMessageAt: '2026-10-19T00:29',
    name: 'Marina Costa',
    photo:
      'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=120&h=120&dpr=2&q=80',
    time: '00:29',
    unreadCount: 2,
  },
  {
    channel: 'messenger',
    id: 'diego',
    initials: 'DA',
    lastMessage: 'Tamo indo.',
    lastMessageAt: '2026-10-19T00:27',
    name: 'Diego Almeida',
    time: '00:27',
    unreadCount: 0,
  },
  {
    channel: 'whatsapp',
    id: 'luiza',
    initials: 'LF',
    lastMessage: 'Pagamento confirmado, obrigada!',
    lastMessageAt: '2026-10-18T21:40',
    name: 'Luiza Ferreira',
    photo:
      'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=120&h=120&dpr=2&q=80',
    time: 'Ontem',
    unreadCount: 1,
  },
  {
    channel: 'instagram',
    id: 'paulo',
    initials: 'PN',
    lastMessage: 'Vi o post, ainda tem no tamanho M?',
    lastMessageAt: '2026-10-17T15:12',
    name: 'Paulo Nogueira',
    time: 'Sex',
    unreadCount: 0,
  },
  {
    channel: 'whatsapp',
    id: 'beatriz',
    initials: 'BL',
    lastMessage: 'Pode ser às 15h?',
    lastMessageAt: '2026-10-15T09:05',
    name: 'Beatriz Lima',
    time: '15/10',
    unreadCount: 0,
  },
]

export const unreadLabel = (count: number) =>
  count === 1 ? '1 não lida' : `${count} não lidas`

export function ChatAvatar({ chat }: Readonly<{ chat: ChatSummary }>) {
  return (
    <Avatar>
      {chat.photo ? <AvatarImage alt="" src={chat.photo} /> : null}
      <AvatarFallback>{chat.initials}</AvatarFallback>
    </Avatar>
  )
}
