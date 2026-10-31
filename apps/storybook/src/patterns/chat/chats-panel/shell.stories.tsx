import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatsPanel, ChatsPanelList } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  args: {
    children: (
      <ChatsPanelList>
        <li>Marina Costa</li>
      </ChatsPanelList>
    ),
    title: 'Chat',
  },
  component: ChatsPanel,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Shell',
} satisfies Meta<typeof ChatsPanel>

export default meta
type Story = StoryObj<typeof meta>

const panel = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('region', { name: 'Chat' })
const part = (canvasElement: HTMLElement, slot: string) =>
  panel(canvasElement).querySelector(`[data-slot="${slot}"]`)

export const PlainSectionNamedByTitle: Story = {
  play: async ({ canvasElement }) => {
    const root = panel(canvasElement)
    await expect(root.tagName).toBe('SECTION')
    await expect(root).toHaveAttribute('data-slot', 'chats-panel')
    await expect(root).toHaveAttribute('data-variant', 'plain')
    await expect(root.querySelector('h2')?.textContent).toBe('Chat')
  },
}

export const ListNamedByTitle: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Chat' }).tagName,
    ).toBe('UL')
  },
}

export const PlainRendersNoCard: Story = {
  play: async ({ canvasElement }) => {
    await expect(part(canvasElement, 'card')).toBeNull()
  },
}

export const CardWrapsHeaderAndBody: Story = {
  args: { variant: 'card' },
  play: async ({ canvasElement }) => {
    const card = part(canvasElement, 'card')
    await expect(card?.parentElement).toBe(panel(canvasElement))
    await expect(
      card?.contains(part(canvasElement, 'chats-panel-header')),
    ).toBe(true)
    await expect(card?.contains(part(canvasElement, 'chats-panel-body'))).toBe(
      true,
    )
  },
}

export const InsetWrapsOnlyBody: Story = {
  args: { variant: 'inset' },
  play: async ({ canvasElement }) => {
    const card = part(canvasElement, 'card')
    const header = part(canvasElement, 'chats-panel-header')
    await expect(header?.parentElement).toBe(panel(canvasElement))
    await expect(card?.contains(header)).toBe(false)
    await expect(card?.contains(part(canvasElement, 'chats-panel-body'))).toBe(
      true,
    )
  },
}

export const ActionsOmittedByDefault: Story = {
  play: async ({ canvasElement }) => {
    await expect(part(canvasElement, 'chats-panel-actions')).toBeNull()
  },
}

export const ActionsBesideTitle: Story = {
  args: {
    actions: <button type="button">Exibição</button>,
    children: <p>Body</p>,
  },
  play: async ({ canvasElement }) => {
    const actions = part(canvasElement, 'chats-panel-actions')
    await expect(actions?.textContent).toBe('Exibição')
    await expect(
      panel(canvasElement)
        .querySelector('h2')
        ?.contains(actions ?? null),
    ).toBe(false)
  },
}

export const AvatarSizeFromPanel: Story = {
  play: async ({ canvasElement }) => {
    await expect(panel(canvasElement).className).toContain(
      '[--avatar-size:--spacing(10)]',
    )
  },
}

export const ClassNameOverridesAvatarSize: Story = {
  args: { children: <p>Body</p>, className: '[--avatar-size:--spacing(8)]' },
  play: async ({ canvasElement }) => {
    const { className } = panel(canvasElement)
    await expect(className).toContain('[--avatar-size:--spacing(8)]')
    await expect(className).not.toContain('[--avatar-size:--spacing(10)]')
  },
}
