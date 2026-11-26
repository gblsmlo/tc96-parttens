import {
  ChatsIcon,
  EnvelopeSimpleOpenIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { ChatEmptyState } from '@tc96/ui/chat/chat-states'
import { MenuRadioGroup, MenuRadioItem, MenuSeparator } from '@tc96/ui/menu'
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  ChatsPanelSkeleton,
  type ChatsPanelVariant,
  CollectionToolbar,
  FilterRadioSubmenu,
  ViewSettings,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { NoChatsState } from './chats-panel-layouts.tsx'
import {
  type Channel,
  ChatAvatar,
  type ChatSummary,
  channels,
  chats as sampleChats,
  unreadLabel,
} from './fixtures/chats'

type ChatSort = 'name' | 'oldest' | 'recent'
type ReadStatus = '' | 'read' | 'unread'

const channelOptions = Object.entries(channels).map(
  ([value, { title }]) => [value, title] as const,
)

const readStatusOptions = [
  ['unread', 'Não lidas'],
  ['read', 'Lidas'],
] as const

const sortOptions = [
  ['recent', 'Mais recentes'],
  ['oldest', 'Mais antigas'],
  ['name', 'Nome'],
] as const

const compareChats = {
  name: (a: ChatSummary, b: ChatSummary) =>
    a.name.localeCompare(b.name, 'pt-BR'),
  oldest: (a: ChatSummary, b: ChatSummary) =>
    a.lastMessageAt.localeCompare(b.lastMessageAt),
  recent: (a: ChatSummary, b: ChatSummary) =>
    b.lastMessageAt.localeCompare(a.lastMessageAt),
} satisfies Record<ChatSort, (a: ChatSummary, b: ChatSummary) => number>

const isChatSort = (value: string): value is ChatSort => value in compareChats

export interface ChatInboxProps {
  chats?: ChatSummary[]
  defaultChannel?: Channel | ''
  defaultReadStatus?: ReadStatus
  defaultSelectedChatId?: string
  defaultSort?: ChatSort
  loading?: boolean
  onSelectChat?: (chatId: string) => void
  variant?: ChatsPanelVariant
}

export function ChatInbox({
  chats = sampleChats,
  defaultChannel = '',
  defaultReadStatus = '',
  defaultSelectedChatId = 'marina',
  defaultSort = 'recent',
  loading = false,
  onSelectChat,
  variant = 'plain',
}: Readonly<ChatInboxProps>) {
  const [sort, setSort] = useState<ChatSort>(defaultSort)
  const [channel, setChannel] = useState<string>(defaultChannel)
  const [readStatus, setReadStatus] = useState<string>(defaultReadStatus)
  const [selectedChatId, setSelectedChatId] = useState(defaultSelectedChatId)
  const activeFilterCount = [channel, readStatus].filter(Boolean).length
  const visibleChats = chats
    .filter(
      (chat) =>
        (!channel || chat.channel === channel) &&
        (!readStatus || (readStatus === 'unread') === chat.unreadCount > 0),
    )
    .sort(compareChats[sort])
  const clearFilters = () => {
    setChannel('')
    setReadStatus('')
  }

  return (
    <ChatsPanel
      actions={
        <CollectionToolbar
          aria-label="Ajustes das conversas"
          right={
            <ViewSettings
              activeFilterCount={activeFilterCount}
              onClearFilters={clearFilters}
            >
              <ViewSettingsSection label="Ordenar por">
                <MenuRadioGroup
                  onValueChange={(next: string) => {
                    if (isChatSort(next)) setSort(next)
                  }}
                  value={sort}
                >
                  {sortOptions.map(([value, label]) => (
                    <MenuRadioItem key={value} value={value}>
                      {label}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              </ViewSettingsSection>
              <MenuSeparator />
              <ViewSettingsSection label="Filtros">
                <FilterRadioSubmenu
                  icon={ChatsIcon}
                  label="Canal"
                  onValueChange={setChannel}
                  options={channelOptions}
                  value={channel}
                />
                <FilterRadioSubmenu
                  icon={EnvelopeSimpleOpenIcon}
                  label="Leitura"
                  onValueChange={setReadStatus}
                  options={readStatusOptions}
                  value={readStatus}
                />
              </ViewSettingsSection>
            </ViewSettings>
          }
        />
      }
      className="h-[32rem] w-96"
      title="Chat"
      variant={variant}
    >
      {loading ? (
        <ChatsPanelSkeleton label="Carregando conversas" />
      ) : chats.length === 0 ? (
        <NoChatsState />
      ) : visibleChats.length === 0 ? (
        <ChatEmptyState
          description="Nenhuma conversa corresponde aos filtros."
          icon={<MagnifyingGlassIcon aria-hidden="true" />}
          title="Nenhuma conversa encontrada"
        >
          <Button onClick={clearFilters} size="sm" variant="outline">
            Limpar filtros
          </Button>
        </ChatEmptyState>
      ) : (
        <ChatsPanelList>
          {visibleChats.map((chat) => (
            <ChatsPanelItem
              avatar={<ChatAvatar chat={chat} />}
              channel={channels[chat.channel]}
              key={chat.id}
              name={chat.name}
              onClick={() => {
                setSelectedChatId(chat.id)
                onSelectChat?.(chat.id)
              }}
              preview={chat.lastMessage}
              selected={chat.id === selectedChatId}
              time={<time dateTime={chat.lastMessageAt}>{chat.time}</time>}
              unreadCount={chat.unreadCount}
              unreadLabel={unreadLabel(chat.unreadCount)}
            />
          ))}
        </ChatsPanelList>
      )}
    </ChatsPanel>
  )
}
