import { TrayIcon } from '@phosphor-icons/react'
import { ChatEmptyState } from '@tc96/ui/chat/chat-states'
import { MenuRadioGroup, MenuRadioItem } from '@tc96/ui/menu'
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  ChatsPanelSkeleton,
  CollectionToolbar,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import type { ChatsPanelControls } from './chats-panel-controls.ts'
import { ChatAvatar, channels, chats, unreadLabel } from './fixtures/chats'

export const SortActions = () => (
  <CollectionToolbar
    aria-label="Ajustes das conversas"
    right={
      <ViewSettingsMenu onClearFilters={() => {}}>
        <ViewSettingsSection label="Ordenar por">
          <MenuRadioGroup defaultValue="recent">
            <MenuRadioItem value="recent">Mais recentes</MenuRadioItem>
            <MenuRadioItem value="name">Nome</MenuRadioItem>
          </MenuRadioGroup>
        </ViewSettingsSection>
      </ViewSettingsMenu>
    }
  />
)

export const NoChatsState = () => (
  <ChatEmptyState
    description="As conversas dos seus canais aparecem aqui."
    icon={<TrayIcon aria-hidden="true" />}
    title="Nenhuma conversa"
  />
)

type ItemParts = Pick<
  ChatsPanelControls,
  'channel' | 'itemElement' | 'preview' | 'selected' | 'time'
>

export const ChatItems = ({
  channel,
  itemElement,
  preview,
  selected,
  time,
}: Readonly<ItemParts>) =>
  chats.map((chat, index) => (
    <ChatsPanelItem
      avatar={<ChatAvatar chat={chat} />}
      channel={channel ? channels[chat.channel] : undefined}
      key={chat.id}
      name={chat.name}
      preview={preview ? chat.lastMessage : undefined}
      render={
        itemElement === 'link'
          ? (props) => <a {...props} href={`#chat-${chat.id}`} />
          : undefined
      }
      selected={selected && index === 0}
      time={
        time ? (
          <time dateTime={chat.lastMessageAt}>{chat.time}</time>
        ) : undefined
      }
      unreadCount={chat.unreadCount}
      unreadLabel={unreadLabel(chat.unreadCount)}
    />
  ))

export const ComposedChatsPanel = ({
  actions,
  content,
  title,
  variant,
  ...parts
}: Readonly<ChatsPanelControls>) => (
  <ChatsPanel
    actions={actions ? <SortActions /> : undefined}
    className="h-[32rem] w-96"
    title={title}
    variant={variant}
  >
    {content === 'loading' ? (
      <ChatsPanelSkeleton label="Carregando conversas" />
    ) : content === 'empty' ? (
      <NoChatsState />
    ) : (
      <ChatsPanelList>
        <ChatItems {...parts} />
      </ChatsPanelList>
    )}
  </ChatsPanel>
)

export const StandaloneList = () => (
  <ChatsPanelList aria-label="Conversas recentes" className="w-96">
    {chats.slice(0, 3).map((chat) => (
      <ChatsPanelItem
        avatar={<ChatAvatar chat={chat} />}
        channel={channels[chat.channel]}
        key={chat.id}
        name={chat.name}
        preview={chat.lastMessage}
        time={<time dateTime={chat.lastMessageAt}>{chat.time}</time>}
        unreadCount={chat.unreadCount}
        unreadLabel={unreadLabel(chat.unreadCount)}
      />
    ))}
  </ChatsPanelList>
)
