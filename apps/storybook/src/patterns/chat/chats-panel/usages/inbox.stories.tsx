import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  ChatsPanelSkeleton,
  type ChatsPanelVariant,
  CollectionToolbar,
  FilterRadioSubmenu,
  MenuRadioOption,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { ChatEmptyState } from '@tc96/ui/chat/chat-states'
import { MenuRadioGroup, MenuSeparator } from '@tc96/ui/menu'
import {
  InboxIcon,
  MailOpenIcon,
  MessagesSquareIcon,
  SearchXIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { chatsPanelArgTypes } from '../../../../test-utils/story-arg-types'
import {
  type Channel,
  ChannelMark,
  ChatAvatar,
  type ChatSummary,
  channels,
  chats,
  unreadLabel,
} from '../fixtures/chats'

type ChatSort = 'name' | 'oldest' | 'recent'
type ReadStatus = '' | 'read' | 'unread'

const channelOptions = Object.entries(channels).map(
  ([value, { label }]) => [value, label] as const,
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

interface InboxArgs {
  chats: ChatSummary[]
  defaultChannel: Channel | ''
  defaultReadStatus: ReadStatus
  defaultSelectedChatId?: string
  defaultSort: ChatSort
  loading: boolean
  onSelectChat: (chatId: string) => void
  variant: ChatsPanelVariant
}

const meta = {
  args: {
    chats,
    defaultChannel: '',
    defaultReadStatus: '',
    defaultSelectedChatId: 'marina',
    defaultSort: 'recent',
    loading: false,
    onSelectChat: fn((_chatId: string) => {}),
    variant: 'plain',
  },
  argTypes: {
    defaultChannel: {
      control: 'inline-radio',
      options: ['', ...Object.keys(channels)],
    },
    defaultReadStatus: {
      control: 'inline-radio',
      options: ['', 'unread', 'read'],
    },
    defaultSelectedChatId: {
      control: 'select',
      options: chats.map((chat) => chat.id),
    },
    defaultSort: {
      control: 'inline-radio',
      options: Object.keys(compareChats),
    },
    variant: chatsPanelArgTypes.variant,
  },
  parameters: {
    docs: {
      description: {
        component:
          'An inbox on the `ChatsPanel` pattern. The `ViewSettingsMenu` (`Exibição`) in `actions` sorts the list (`Ordenar por`) and filters it by channel and read status with `FilterRadioSubmenu`; the trigger counts the active filters and `Limpar filtros` resets them. The story owns the selection, the sort and the filters, as a consumer would: the pattern only renders the rows it receives. `loading` swaps the list for `ChatsPanelSkeleton`, an empty `chats` shows `ChatEmptyState`, and filters that match nothing offer to clear them.',
      },
    },
  },
  render: function Inbox({
    chats,
    defaultChannel,
    defaultReadStatus,
    defaultSelectedChatId,
    defaultSort,
    loading,
    onSelectChat,
    variant,
  }) {
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
            endSlot={
              <ViewSettingsMenu
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
                      <MenuRadioOption key={value} value={value}>
                        {label}
                      </MenuRadioOption>
                    ))}
                  </MenuRadioGroup>
                </ViewSettingsSection>
                <MenuSeparator />
                <ViewSettingsSection label="Filtros">
                  <FilterRadioSubmenu
                    icon={MessagesSquareIcon}
                    label="Canal"
                    onValueChange={setChannel}
                    options={channelOptions}
                    value={channel}
                  />
                  <FilterRadioSubmenu
                    icon={MailOpenIcon}
                    label="Leitura"
                    onValueChange={setReadStatus}
                    options={readStatusOptions}
                    value={readStatus}
                  />
                </ViewSettingsSection>
              </ViewSettingsMenu>
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
          <ChatEmptyState
            description="As conversas dos seus canais aparecem aqui."
            icon={<InboxIcon aria-hidden="true" />}
            title="Nenhuma conversa"
          />
        ) : visibleChats.length === 0 ? (
          <ChatEmptyState
            description="Nenhuma conversa corresponde aos filtros."
            icon={<SearchXIcon aria-hidden="true" />}
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
                channel={<ChannelMark channel={chat.channel} />}
                channelLabel={channels[chat.channel].label}
                key={chat.id}
                name={chat.name}
                onClick={() => {
                  setSelectedChatId(chat.id)
                  onSelectChat(chat.id)
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
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Usages/Inbox',
} satisfies Meta<InboxArgs>

export default meta
type Story = StoryObj<typeof meta>

const chatNames = (list: HTMLElement) =>
  within(list)
    .getAllByRole('listitem')
    .map(
      (item) =>
        chats.find((chat) => item.textContent?.includes(chat.name))?.name,
    )

export const Default: Story = {}

export const SelectChat: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Clicking a row moves `aria-current` to it and reports its id through `onSelectChat`.',
      },
    },
  },
  play: async ({ args, canvas }) => {
    const current = canvas.getByRole('button', { current: true })
    await expect(current).toHaveAccessibleName(/^Marina Costa/)

    await userEvent.click(
      canvas.getByRole('button', { name: /^Luiza Ferreira/ }),
    )
    await expect(args.onSelectChat).toHaveBeenCalledWith('luiza')
    await expect(
      canvas.getByRole('button', { name: /^Luiza Ferreira/ }),
    ).toHaveAttribute('aria-current', 'true')
    await expect(current).not.toHaveAttribute('aria-current')
  },
}

export const SortByName: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`Ordenar por` in the `Exibição` menu reorders the list; the default is the most recent message first.',
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const list = canvas.getByRole('list', { name: 'Chat' })
    await expect(chatNames(list)[0]).toBe('Marina Costa')

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Nome' }),
    )
    await expect(chatNames(list)).toEqual([
      'Beatriz Lima',
      'Diego Almeida',
      'Luiza Ferreira',
      'Marina Costa',
      'Paulo Nogueira',
    ])
  },
}

export const FilterByChannel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`Canal` keeps only the conversations of one channel and the trigger counts the active filter; `Limpar filtros` brings the whole list back.',
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))
    await userEvent.click(await body.findByRole('menuitem', { name: 'Canal' }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'WhatsApp' }),
    )
    await userEvent.keyboard('[Escape][Escape]')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    const list = canvas.getByRole('list', { name: 'Chat' })
    await expect(chatNames(list)).toEqual(['Luiza Ferreira', 'Beatriz Lima'])

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição (1)' }))
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await waitFor(() =>
      expect(within(list).getAllByRole('listitem')).toHaveLength(5),
    )
    await expect(canvas.getByRole('button', { name: 'Exibição' })).toBeVisible()
  },
}

export const NoResults: Story = {
  args: { defaultChannel: 'instagram', defaultReadStatus: 'unread' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nenhuma conversa encontrada')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Exibição (2)' }),
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Limpar filtros' }),
    )
    await expect(
      within(canvas.getByRole('list', { name: 'Chat' })).getAllByRole(
        'listitem',
      ),
    ).toHaveLength(5)
  },
}

export const Empty: Story = {
  args: { chats: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nenhuma conversa')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('status', { name: 'Carregando conversas' }),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}
