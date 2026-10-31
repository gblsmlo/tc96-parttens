import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatsPanelItem,
  ChatsPanelItemSkeleton,
  ChatsPanelSkeleton,
  chatsPanelSkeletonWidths,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  args: { label: 'Carregando conversas' },
  component: ChatsPanelSkeleton,
  decorators: [
    (Story) => (
      <div className="w-96 [--avatar-size:--spacing(10)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Chats Panel/Skeleton',
} satisfies Meta<typeof ChatsPanelSkeleton>

export default meta
type Story = StoryObj<typeof meta>

const rows = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="chats-panel-item-skeleton"]',
    ),
  )

const widths = (row: HTMLElement) =>
  Array.from(row.querySelectorAll('[data-width]')).map((line) =>
    line.getAttribute('data-width'),
  )

export const BusyStatusNamedByLabel: Story = {
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', {
      name: 'Carregando conversas',
    })
    await expect(status).toHaveAttribute('aria-busy', 'true')
    await expect(status).toHaveAttribute('data-slot', 'chats-panel-skeleton')
  },
}

export const SixHiddenRowsCyclingWidths: Story = {
  play: async ({ canvasElement }) => {
    await expect(rows(canvasElement)).toHaveLength(6)
    await expect(
      rows(canvasElement).every(
        (row) => row.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true)
    await expect(rows(canvasElement).map(widths)).toEqual([
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
  args: { count: 2 },
  play: async ({ canvasElement }) => {
    await expect(rows(canvasElement)).toHaveLength(2)
  },
}

export const NegativeCountRendersNoRows: Story = {
  args: { count: -1 },
  play: async ({ canvasElement }) => {
    await expect(rows(canvasElement)).toHaveLength(0)
  },
}

export const SharesItemRowBox: Story = {
  play: async ({ canvasElement }) => {
    const [row] = rows(canvasElement)
    const trigger = within(canvasElement).getByRole('button', {
      name: /Marina Costa/,
    })
    const itemClasses = trigger.className.split(' ')
    await expect(
      row?.className.split(' ').every((name) => itemClasses.includes(name)),
    ).toBe(true)
    await expect(row?.getBoundingClientRect().height).toBe(
      trigger.getBoundingClientRect().height,
    )
    const avatar = row?.querySelector('[data-slot="skeleton"]')
    await expect(avatar?.className).toContain('size-(--avatar-size)')
    await expect(avatar?.className).toContain('rounded-full')
    await expect(avatar?.getBoundingClientRect().width).toBe(40)
  },
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
}

export const OneWidthClassPerSize: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      rows(canvasElement).map(
        (row) =>
          row.querySelector('[data-width]')?.className.match(/\bw-\d+/)?.[0],
      ),
    ).toEqual(['w-8', 'w-16', 'w-24', 'w-32', 'w-44'])
  },
  render: () => (
    <div className="flex flex-col">
      {chatsPanelSkeletonWidths.map((width) => (
        <ChatsPanelItemSkeleton key={width} nameWidth={width} />
      ))}
    </div>
  ),
}
