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

const portrait = (background: string, skin: string, clothes: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${background}"/><circle cx="20" cy="16" r="7" fill="${skin}"/><path d="M6 40a14 13 0 0 1 28 0z" fill="${clothes}"/></svg>`,
  )}`

export const chats: ChatSummary[] = [
  {
    channel: 'messenger',
    id: 'marina',
    initials: 'MC',
    lastMessage: 'Consegue me mandar a proposta até amanhã?',
    lastMessageAt: '2026-10-19T00:29',
    name: 'Marina Costa',
    photo: portrait('#c7d2fe', '#e0b48c', '#4338ca'),
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
    photo: portrait('#fde68a', '#8d5a3b', '#b45309'),
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
