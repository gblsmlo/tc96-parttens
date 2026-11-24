import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelItemSkeleton,
  ChatsPanelList,
  ChatsPanelSkeleton,
  chatsPanelSkeletonWidths,
} from '@tc96/ui/patterns'
import { expect, fn, isInaccessible, userEvent, within } from 'storybook/test'
import { chatsPanelControlArgs } from './chats-panel-controls.ts'
import { ItemCanvas, SkeletonCanvas } from './chats-panel-frame.tsx'
import { ChatItems, ComposedChatsPanel } from './chats-panel-layouts.tsx'
import { channels, chats } from './fixtures/chats'

interface BehaviorArgs {
  onClick: () => void
}

const meta = {
  args: { onClick: fn() },
  argTypes: { onClick: { control: false } },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const messenger = channels.messenger

const panel = (canvasElement: HTMLElement, name = 'Chat') =>
  within(canvasElement).getByRole('region', { name })

const part = (scope: HTMLElement, slot: string) =>
  scope.querySelector<HTMLElement>(`[data-slot="${slot}"]`)

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: /^Marina Costa/ })

const item = (canvasElement: HTMLElement) =>
  trigger(canvasElement).closest('li') as HTMLElement

const skeletonRows = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="chats-panel-item-skeleton"]',
    ),
  )

const skeletonWidths = (row: HTMLElement) =>
  Array.from(row.querySelectorAll('[data-width]')).map((line) =>
    line.getAttribute('data-width'),
  )

const itemArgs = {
  avatar: <span>MC</span>,
  channel: messenger,
  name: 'Marina Costa',
  preview: 'Consegue me mandar a proposta?',
  time: '00:29',
}

export const SectionNamedByTitle: Story = {
  render: () => <ComposedChatsPanel {...chatsPanelControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root.tagName).toBe('SECTION')
    await expect(root).toHaveAttribute('data-slot', 'chats-panel')
    await expect(root).toHaveAttribute('data-variant', 'plain')
    await expect(
      within(root).getByRole('heading', { level: 2, name: 'Chat' }),
    ).toBeVisible()
  },
}

export const ListNamedByTitle: Story = {
  render: () => <ComposedChatsPanel {...chatsPanelControlArgs} />,
  play: async ({ canvasElement }) => {
    const list = within(panel(canvasElement)).getByRole('list', {
      name: 'Chat',
    })
    await expect(list.tagName).toBe('UL')
    await expect(within(list).getAllByRole('listitem')).toHaveLength(
      chats.length,
    )
  },
}

export const PlainRendersNoCard: Story = {
  render: () => <ComposedChatsPanel {...chatsPanelControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(part(panel(canvasElement), 'card')).toBeNull()
  },
}

export const CardWrapsHeaderAndBody: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} variant="card" />
  ),
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    const card = part(root, 'card')
    await expect(card?.parentElement).toBe(root)
    await expect(card).toContainElement(part(root, 'chats-panel-header'))
    await expect(card).toContainElement(part(root, 'chats-panel-body'))
  },
}

export const InsetWrapsOnlyBody: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} variant="inset" />
  ),
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    const card = part(root, 'card')
    const header = part(root, 'chats-panel-header')
    await expect(header?.parentElement).toBe(root)
    await expect(card).not.toContainElement(header)
    await expect(card).toContainElement(part(root, 'chats-panel-body'))
    await expect(card).toContainElement(
      within(root).getByRole('list', { name: 'Chat' }),
    )
  },
}

export const ActionsBesideTitle: Story = {
  render: () => <ComposedChatsPanel {...chatsPanelControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    const actions = part(root, 'chats-panel-actions')
    await expect(
      within(actions as HTMLElement).getByRole('button', { name: 'Exibição' }),
    ).toBeVisible()
    await expect(part(root, 'chats-panel-header')).toContainElement(actions)
    await expect(root.querySelector('h2')).not.toContainElement(actions)
  },
}

export const ActionsOmittedWithoutProp: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} actions={false} />
  ),
  play: async ({ canvasElement }) => {
    await expect(part(panel(canvasElement), 'chats-panel-actions')).toBeNull()
  },
}

export const AvatarSizeFromPanel: Story = {
  render: () => <ComposedChatsPanel {...chatsPanelControlArgs} />,
  play: async ({ canvasElement }) => {
    const avatar = part(panel(canvasElement), 'avatar')
    await expect(avatar?.getBoundingClientRect().width).toBe(40)
  },
}

export const ClassNameOverridesAvatarSize: Story = {
  render: () => (
    <ChatsPanel
      className="h-[32rem] w-96 [--avatar-size:--spacing(8)]"
      title="Chat"
    >
      <ChatsPanelList>
        <ChatItems channel itemElement="button" preview selected={false} time />
      </ChatsPanelList>
    </ChatsPanel>
  ),
  play: async ({ canvasElement }) => {
    const avatar = part(panel(canvasElement), 'avatar')
    await expect(avatar?.getBoundingClientRect().width).toBe(32)
  },
}

export const BodyRendersAnyChildren: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} content="empty" />
  ),
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    const empty = within(root).getByText('Nenhuma conversa')
    await expect(empty).toBeVisible()
    await expect(part(root, 'chats-panel-body')).toContainElement(empty)
    await expect(within(root).queryByRole('list')).toBeNull()
  },
}

export const ButtonNamedByItsParts: Story = {
  decorators: [ItemCanvas],
  render: () => <ChatsPanelItem {...itemArgs} />,
  play: async ({ canvasElement }) => {
    await expect(item(canvasElement)).toHaveAttribute(
      'data-slot',
      'chats-panel-item',
    )
    await expect(trigger(canvasElement)).toHaveAttribute('type', 'button')
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Marina Costa Messenger 00:29 Consegue me mandar a proposta?',
      }),
    ).toBe(trigger(canvasElement))
  },
}

export const AvatarSlotHidden: Story = {
  decorators: [ItemCanvas],
  render: () => (
    <ChatsPanelItem {...itemArgs} unreadCount={2} unreadLabel="2 não lidas" />
  ),
  play: async ({ canvasElement }) => {
    const slot = part(item(canvasElement), 'chats-panel-item-avatar')
    await expect(slot).toHaveAttribute('aria-hidden', 'true')
    await expect(isInaccessible(slot as HTMLElement)).toBe(true)
    await expect(part(slot as HTMLElement, 'badge')).toHaveTextContent('2')
    await expect(
      part(slot as HTMLElement, 'chats-panel-item-channel'),
    ).not.toBeNull()
  },
}

export const ChannelSvgAsImage: Story = {
  decorators: [ItemCanvas],
  render: () => <ChatsPanelItem {...itemArgs} />,
  play: async ({ canvasElement }) => {
    const mark = part(item(canvasElement), 'chats-panel-item-channel')
    await expect(mark?.tagName).toBe('IMG')
    await expect(mark).toHaveAttribute('alt', '')
    await expect(mark).toHaveAttribute(
      'src',
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(messenger.svg)}`,
    )
  },
}

export const ChannelLabelOverIconTitle: Story = {
  decorators: [ItemCanvas],
  render: () => (
    <ChatsPanelItem {...itemArgs} channelLabel="Facebook Messenger" />
  ),
  play: async ({ canvasElement }) => {
    await expect(trigger(canvasElement)).toHaveAccessibleName(
      'Marina Costa Facebook Messenger 00:29 Consegue me mandar a proposta?',
    )
  },
}

export const UnreadSpokenAndInked: Story = {
  decorators: [ItemCanvas],
  render: () => (
    <ChatsPanelItem {...itemArgs} unreadCount={2} unreadLabel="2 não lidas" />
  ),
  play: async ({ canvasElement }) => {
    await expect(item(canvasElement)).toHaveAttribute('data-unread', 'true')
    await expect(trigger(canvasElement)).toHaveAccessibleName(
      'Marina Costa Messenger, 2 não lidas 00:29 Consegue me mandar a proposta?',
    )
    await expect(
      part(item(canvasElement), 'chats-panel-item-preview')?.className,
    ).toContain('text-foreground')
  },
}

export const ZeroUnreadDropsBadgeAndLabel: Story = {
  decorators: [ItemCanvas],
  render: () => (
    <ChatsPanelItem {...itemArgs} unreadCount={0} unreadLabel="0 não lidas" />
  ),
  play: async ({ canvasElement }) => {
    await expect(item(canvasElement)).not.toHaveAttribute('data-unread')
    await expect(part(item(canvasElement), 'badge')).toBeNull()
    await expect(trigger(canvasElement).textContent).not.toContain('não lidas')
    await expect(
      part(item(canvasElement), 'chats-panel-item-preview')?.className,
    ).toContain('text-muted-foreground')
  },
}

export const SelectedSetsAriaCurrent: Story = {
  render: () => (
    <ComposedChatsPanel {...chatsPanelControlArgs} selected variant="card" />
  ),
  play: async ({ canvasElement }) => {
    const list = within(panel(canvasElement)).getByRole('list', {
      name: 'Chat',
    })
    const current = within(list).getByRole('button', { current: true })
    await expect(current).toHaveAttribute('aria-current', 'true')
    await expect(current).toHaveAccessibleName(/^Marina Costa/)
    await expect(
      within(list)
        .getAllByRole('button')
        .filter((row) => row.hasAttribute('aria-current')),
    ).toEqual([current])
  },
}

export const UnselectedHasNoAriaCurrent: Story = {
  decorators: [ItemCanvas],
  render: () => <ChatsPanelItem avatar={null} name="Marina Costa" />,
  play: async ({ canvasElement }) => {
    await expect(trigger(canvasElement)).not.toHaveAttribute('aria-current')
  },
}

export const OmitsUnpassedParts: Story = {
  decorators: [ItemCanvas],
  render: () => <ChatsPanelItem avatar={null} name="Marina Costa" />,
  play: async ({ canvasElement }) => {
    const listItem = item(canvasElement)
    await expect(trigger(canvasElement).textContent).toBe('Marina Costa')
    await expect(part(listItem, 'chats-panel-item-channel')).toBeNull()
    await expect(part(listItem, 'chats-panel-item-time')).toBeNull()
    await expect(part(listItem, 'chats-panel-item-preview')).toBeNull()
  },
}

export const ClickCallsOnClick: Story = {
  decorators: [ItemCanvas],
  render: ({ onClick }) => <ChatsPanelItem {...itemArgs} onClick={onClick} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(trigger(canvasElement))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const RenderAsLink: Story = {
  decorators: [ItemCanvas],
  render: () => (
    <ChatsPanelItem
      avatar={null}
      name="Marina Costa"
      render={(props) => <a {...props} href="#chats-marina" />}
      selected
    />
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Marina Costa',
    })
    await expect(link).toHaveAttribute('href', '#chats-marina')
    await expect(link).not.toHaveAttribute('type')
    await expect(link).toHaveAttribute('aria-current', 'true')
  },
}

export const SkeletonIsBusyStatus: Story = {
  decorators: [SkeletonCanvas],
  render: () => <ChatsPanelSkeleton label="Carregando conversas" />,
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', {
      name: 'Carregando conversas',
    })
    await expect(status.tagName).toBe('OUTPUT')
    await expect(status).toHaveAttribute('aria-busy', 'true')
    await expect(status).toHaveAttribute('data-slot', 'chats-panel-skeleton')
  },
}

export const SixHiddenRowsCyclingWidths: Story = {
  decorators: [SkeletonCanvas],
  render: () => <ChatsPanelSkeleton label="Carregando conversas" />,
  play: async ({ canvasElement }) => {
    const rows = skeletonRows(canvasElement)
    await expect(rows).toHaveLength(6)
    for (const row of rows) {
      await expect(isInaccessible(row)).toBe(true)
    }
    await expect(rows.map(skeletonWidths)).toEqual([
      ['md', 'xl'],
      ['lg', 'lg'],
      ['sm', 'xl'],
      ['md', 'md'],
      ['md', 'xl'],
      ['lg', 'lg'],
    ])
  },
}

export const CountRows: Story = {
  decorators: [SkeletonCanvas],
  render: () => <ChatsPanelSkeleton count={2} label="Carregando conversas" />,
  play: async ({ canvasElement }) => {
    await expect(skeletonRows(canvasElement)).toHaveLength(2)
  },
}

export const NegativeCountRendersNoRows: Story = {
  decorators: [SkeletonCanvas],
  render: () => <ChatsPanelSkeleton count={-1} label="Carregando conversas" />,
  play: async ({ canvasElement }) => {
    await expect(skeletonRows(canvasElement)).toHaveLength(0)
  },
}

export const SkeletonSharesItemRowBox: Story = {
  decorators: [SkeletonCanvas],
  render: () => (
    <div className="flex flex-col">
      <ChatsPanelItemSkeleton />
      <ul>
        <ChatsPanelItem
          avatar={<span className="block size-10" />}
          name="Marina Costa"
          preview="Consegue me mandar a proposta?"
          time="00:29"
        />
      </ul>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [row] = skeletonRows(canvasElement)
    const button = trigger(canvasElement)
    const itemClasses = button.className.split(' ')
    await expect(
      row?.className.split(' ').every((name) => itemClasses.includes(name)),
    ).toBe(true)
    await expect(row?.getBoundingClientRect().height).toBe(
      button.getBoundingClientRect().height,
    )
    const avatar = row?.querySelector('[data-slot="skeleton"]')
    await expect(avatar?.className).toContain('size-(--avatar-size)')
    await expect(avatar?.className).toContain('rounded-full')
    await expect(avatar?.getBoundingClientRect().width).toBe(40)
  },
}

export const OneWidthClassPerSize: Story = {
  decorators: [SkeletonCanvas],
  render: () => (
    <div className="flex flex-col">
      {chatsPanelSkeletonWidths.map((width) => (
        <ChatsPanelItemSkeleton key={width} nameWidth={width} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      skeletonRows(canvasElement).map(
        (row) =>
          row.querySelector('[data-width]')?.className.match(/\bw-\d+/)?.[0],
      ),
    ).toEqual(['w-8', 'w-16', 'w-24', 'w-32', 'w-44'])
  },
}
