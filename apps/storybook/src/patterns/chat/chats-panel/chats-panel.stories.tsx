import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  ChatsPanelSkeleton,
  CollectionToolbar,
  MenuRadioOption,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { ChatEmptyState } from '@tc96/ui/chat/chat-states'
import { MenuRadioGroup } from '@tc96/ui/menu'
import { InboxIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { chatsPanelArgTypes } from '../../../test-utils/story-arg-types'
import { ChatAvatar, channels, chats, unreadLabel } from './fixtures/chats'

const usage = `
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  ChatsPanelSkeleton,
} from '@acme/patterns'
import messenger from '@thesvg/icons/messenger'

<ChatsPanel actions={viewSettings} className="h-full" title="Chat" variant="card">
  {loading ? (
    <ChatsPanelSkeleton label="Carregando conversas" />
  ) : (
    <ChatsPanelList>
      {chats.map((chat) => (
        <ChatsPanelItem
          avatar={<Avatar>…</Avatar>}
          channel={messenger}
          key={chat.id}
          name={chat.name}
          onClick={() => openChat(chat.id)}
          preview={chat.lastMessage}
          selected={chat.id === openChatId}
          time={<time dateTime={chat.lastMessageAt}>{chat.time}</time>}
          unreadCount={chat.unreadCount}
          unreadLabel={\`\${chat.unreadCount} não lidas\`}
        />
      ))}
    </ChatsPanelList>
  )}
</ChatsPanel>
`

const docs = {
  api: [
    {
      description:
        'Root component. A `section` named by its `h2` `title`, with the `actions` slot at the end of the header and a COSS `ScrollArea` body. `variant` is `plain` (no frame), `card` (header and body in one muted panel) or `inset` (header outside, body in the panel). It sets `--avatar-size` to 40px for the COSS `Avatar` inside; override it through `className`.',
      name: 'ChatsPanel',
    },
    {
      description: 'The `ul` of conversations, named by the panel title.',
      name: 'ChatsPanelList',
    },
    {
      description:
        'One conversation, a `li` with a `button` (or the consumer element through `render`). `avatar` takes the avatar, `unreadCount` puts a `Badge` on its top corner and `channel`, an icon module from `@thesvg/icons` (a peer dependency), draws its brand mark as an `img` on its bottom corner; the slot is hidden from screen readers, which read the icon `title` (or `channelLabel`) and `unreadLabel` after `name`. `time` and `preview` fill the two lines, and `selected` sets `aria-current`.',
      name: 'ChatsPanelItem',
    },
    {
      description:
        'Loading state: a busy `output` named by `label` with `count` rows (6) of `ChatsPanelItemSkeleton`, which shares the row box of the item. `nameWidth` and `previewWidth` take the width sizes `xs` to `xl` (`chatsPanelSkeletonWidths`), and the panel cycles them so the rows differ.',
      name: 'ChatsPanelSkeleton, ChatsPanelItemSkeleton',
    },
  ],
  description: {
    component:
      'A controlled list of conversations for an inbox. The consumer passes the conversations, their avatars and brand marks, the selection and the copy, and sorts and filters them itself; `actions` takes the `ViewSettingsMenu` that drives it.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    actions: (
      <CollectionToolbar
        aria-label="Ajustes das conversas"
        endSlot={
          <ViewSettingsMenu onClearFilters={() => {}}>
            <ViewSettingsSection label="Ordenar por">
              <MenuRadioGroup defaultValue="recent">
                <MenuRadioOption value="recent">Mais recentes</MenuRadioOption>
                <MenuRadioOption value="name">Nome</MenuRadioOption>
              </MenuRadioGroup>
            </ViewSettingsSection>
          </ViewSettingsMenu>
        }
      />
    ),
    children: (
      <ChatsPanelList>
        {chats.map((chat) => (
          <ChatsPanelItem
            avatar={<ChatAvatar chat={chat} />}
            channel={channels[chat.channel]}
            key={chat.id}
            name={chat.name}
            preview={chat.lastMessage}
            selected={chat.id === 'marina'}
            time={<time dateTime={chat.lastMessageAt}>{chat.time}</time>}
            unreadCount={chat.unreadCount}
            unreadLabel={unreadLabel(chat.unreadCount)}
          />
        ))}
      </ChatsPanelList>
    ),
    className: 'h-[32rem] w-96',
    title: 'Chat',
    variant: 'plain',
  },
  argTypes: chatsPanelArgTypes,
  component: ChatsPanel,
  parameters: { docs },
  title: 'Patterns/Chat/Chats Panel',
} satisfies Meta<typeof ChatsPanel>

export default meta

type Story = StoryObj<typeof meta>

const panel = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('region', { name: 'Chat' })

const shell = (canvasElement: HTMLElement) =>
  panel(canvasElement).querySelector('[data-slot="card"]')

const header = (canvasElement: HTMLElement) =>
  panel(canvasElement).querySelector('[data-slot="chats-panel-header"]')

export const Plain: Story = {}

export const PlainInteraction: Story = {
  ...Plain,
  play: async ({ canvasElement }) => {
    await expect(shell(canvasElement)).toBeNull()
    const list = within(canvasElement).getByRole('list', { name: 'Chat' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(5)
    await expect(
      within(canvasElement).getByRole('button', { current: true }),
    ).toHaveAccessibleName(/^Marina Costa/)
  },
  tags: ['!dev', '!autodocs'],
}

export const Card: Story = { args: { variant: 'card' } }

export const CardInteraction: Story = {
  ...Card,
  play: async ({ canvasElement }) => {
    await expect(shell(canvasElement)).toContainElement(
      header(canvasElement) as HTMLElement,
    )
  },
  tags: ['!dev', '!autodocs'],
}

export const Inset: Story = { args: { variant: 'inset' } }

export const InsetInteraction: Story = {
  ...Inset,
  play: async ({ canvasElement }) => {
    await expect(shell(canvasElement)).not.toContainElement(
      header(canvasElement) as HTMLElement,
    )
    await expect(shell(canvasElement)).toContainElement(
      within(canvasElement).getByRole('list', { name: 'Chat' }),
    )
  },
  tags: ['!dev', '!autodocs'],
}

export const Loading: Story = {
  args: {
    children: <ChatsPanelSkeleton label="Carregando conversas" />,
    variant: 'card',
  },
}

export const LoadingInteraction: Story = {
  ...Loading,
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', {
      name: 'Carregando conversas',
    })
    await expect(status).toHaveAttribute('aria-busy', 'true')
    await expect(
      status.querySelectorAll('[data-slot="chats-panel-item-skeleton"]'),
    ).toHaveLength(6)
  },
  tags: ['!dev', '!autodocs'],
}

export const Empty: Story = {
  args: {
    children: (
      <ChatEmptyState
        description="As conversas dos seus canais aparecem aqui."
        icon={<InboxIcon aria-hidden="true" />}
        title="Nenhuma conversa"
      />
    ),
    variant: 'card',
  },
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma conversa'),
    ).toBeVisible()
    await expect(within(canvasElement).queryByRole('list')).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}
