import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatsPanelItem } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const messenger = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#0866FF" d="M0 0h24v24H0z"/></svg>',
  title: 'Messenger',
}

const meta = {
  args: {
    avatar: <span>MC</span>,
    channel: messenger,
    name: 'Marina Costa',
    preview: 'Consegue me mandar a proposta?',
    time: '00:29',
  },
  component: ChatsPanelItem,
  decorators: [
    (Story) => (
      <ul className="w-96">
        <Story />
      </ul>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Item',
} satisfies Meta<typeof ChatsPanelItem>

export default meta
type Story = StoryObj<typeof meta>

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: /Marina Costa/ })
const item = (canvasElement: HTMLElement) =>
  trigger(canvasElement).closest('li') as HTMLElement
const part = (canvasElement: HTMLElement, slot: string) =>
  item(canvasElement).querySelector(`[data-slot="${slot}"]`)

const bare = {
  avatar: null,
  channel: undefined,
  preview: undefined,
  time: undefined,
}

export const ButtonNamedByItsParts: Story = {
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
  args: { unreadCount: 2, unreadLabel: '2 não lidas' },
  play: async ({ canvasElement }) => {
    const slot = part(canvasElement, 'chats-panel-item-avatar')
    await expect(slot).toHaveAttribute('aria-hidden', 'true')
    await expect(slot?.querySelector('[data-slot="badge"]')?.textContent).toBe(
      '2',
    )
    await expect(
      slot?.querySelector('[data-slot="chats-panel-item-channel"]'),
    ).not.toBeNull()
  },
}

export const ChannelSvgAsImage: Story = {
  play: async ({ canvasElement }) => {
    const mark = part(canvasElement, 'chats-panel-item-channel')
    await expect(mark?.tagName).toBe('IMG')
    await expect(mark).toHaveAttribute('alt', '')
    await expect(mark).toHaveAttribute(
      'src',
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(messenger.svg)}`,
    )
  },
}

export const ChannelLabelOverIconTitle: Story = {
  args: { channelLabel: 'Facebook Messenger' },
  play: async ({ canvasElement }) => {
    await expect(trigger(canvasElement).textContent).toContain(
      'Facebook Messenger',
    )
    await expect(trigger(canvasElement).textContent).not.toContain(
      'Marina CostaMessenger',
    )
  },
}

export const UnreadSpokenAndInked: Story = {
  args: { unreadCount: 2, unreadLabel: '2 não lidas' },
  play: async ({ canvasElement }) => {
    await expect(item(canvasElement)).toHaveAttribute('data-unread', 'true')
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Marina Costa Messenger, 2 não lidas 00:29 Consegue me mandar a proposta?',
      }),
    ).toBe(trigger(canvasElement))
    await expect(
      part(canvasElement, 'chats-panel-item-preview')?.className,
    ).toContain('text-foreground')
  },
}

export const ZeroUnreadDropsBadgeAndLabel: Story = {
  args: { unreadCount: 0, unreadLabel: '0 não lidas' },
  play: async ({ canvasElement }) => {
    await expect(item(canvasElement)).not.toHaveAttribute('data-unread')
    await expect(part(canvasElement, 'badge')).toBeNull()
    await expect(trigger(canvasElement).textContent).not.toContain('não lidas')
    await expect(
      part(canvasElement, 'chats-panel-item-preview')?.className,
    ).toContain('text-muted-foreground')
  },
}

export const SelectedSetsAriaCurrent: Story = {
  args: { selected: true },
  play: async ({ canvasElement }) => {
    await expect(trigger(canvasElement)).toHaveAttribute('aria-current', 'true')
  },
}

export const UnselectedHasNoAriaCurrent: Story = {
  args: bare,
  play: async ({ canvasElement }) => {
    await expect(trigger(canvasElement)).not.toHaveAttribute('aria-current')
  },
}

export const OmitsUnpassedParts: Story = {
  args: bare,
  play: async ({ canvasElement }) => {
    await expect(trigger(canvasElement).textContent).toBe('Marina Costa')
    await expect(part(canvasElement, 'chats-panel-item-channel')).toBeNull()
    await expect(part(canvasElement, 'chats-panel-item-time')).toBeNull()
    await expect(part(canvasElement, 'chats-panel-item-preview')).toBeNull()
  },
}

export const ClickCallsOnClick: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(trigger(canvasElement))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const RenderAsLink: Story = {
  args: {
    ...bare,
    render: (props) => <a {...props} href="/chats/marina" />,
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Marina Costa',
    })
    await expect(link).toHaveAttribute('href', '/chats/marina')
    await expect(link).not.toHaveAttribute('type')
    await expect(link).toHaveAttribute('aria-current', 'true')
  },
}
