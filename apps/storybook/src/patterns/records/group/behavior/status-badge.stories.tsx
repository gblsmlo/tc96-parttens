import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupItem,
  RecordGroupLink,
  RecordStatusBadge,
} from '@tc96/parttens'
import { ReceiptTextIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

const tokens = {
  destructive: 'var(--destructive-foreground)',
  info: 'var(--info-foreground)',
  muted: 'var(--muted-foreground)',
  success: 'var(--success-foreground)',
  warning: 'var(--warning-foreground)',
} as const

const statuses = [
  { color: undefined, label: 'Em aberto' },
  { color: tokens.success, label: 'Quitado' },
  { color: tokens.destructive, label: 'Vencido' },
  { color: tokens.warning, label: 'Rascunho' },
  { color: tokens.info, label: 'Agendado' },
  { color: tokens.muted, label: 'Cancelado' },
] as const

const variants = ['plain', 'inset', 'card'] as const

const badgesOf = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="badge"]'),
]

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const StatusBadgeNeutralWithoutColor: Story = {
  play: async ({ canvasElement }) => {
    const [badge] = badgesOf(canvasElement) as [HTMLElement]

    await expect(badge).toHaveTextContent('Em aberto')
    await expect(badge).toHaveAttribute('data-color', 'neutral')
    await expect(badge.getAttribute('style')).toBeNull()
  },
  render: () => <RecordStatusBadge>Em aberto</RecordStatusBadge>,
}

export const StatusBadgeTintsFromColor: Story = {
  play: async ({ canvasElement }) => {
    const badges = badgesOf(canvasElement)

    await expect(badges.map((badge) => badge.textContent)).toEqual(
      statuses.map((status) => status.label),
    )
    for (const [index, status] of statuses.entries()) {
      const badge = badges[index] as HTMLElement
      if (!status.color) {
        await expect(badge).toHaveAttribute('data-color', 'neutral')
        continue
      }
      const style = badge.getAttribute('style') ?? ''
      await expect(badge).toHaveAttribute('data-color', 'custom')
      await expect(style).toContain(
        `color-mix(in srgb, ${status.color} 8%, transparent)`,
      )
      await expect(style).toContain(
        `color-mix(in srgb, ${status.color} 90%, var(--foreground))`,
      )
    }
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map((status) => (
        <RecordStatusBadge color={status.color} key={status.label}>
          {status.label}
        </RecordStatusBadge>
      ))}
    </div>
  ),
}

export const StatusBadgeOneHeightInEveryVariant: Story = {
  play: async ({ canvasElement }) => {
    const badges = badgesOf(canvasElement)
    const heights = new Set(
      badges.map((badge) => badge.getBoundingClientRect().height),
    )

    await expect(badges).toHaveLength(variants.length * 2)
    await expect(heights.size).toBe(1)
    for (const badge of badges) {
      const row = badge.closest(
        '[data-slot="record-group-link"], [data-slot="record-group-item"]',
      ) as HTMLElement
      await expect(badge.getBoundingClientRect().height).toBeLessThanOrEqual(
        row.getBoundingClientRect().height,
      )
      await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    }
    await expect(
      within(canvasElement).getAllByRole('link', { name: /Quitado$/ }),
    ).toHaveLength(variants.length)
  },
  render: () => (
    <div className="flex w-96 max-w-full flex-col gap-6">
      {variants.map((variant) => (
        <RecordGroup
          key={variant}
          title={`Parcelas (${variant})`}
          variant={variant}
        >
          <RecordGroupLink
            href={`#/parcelas/${variant}-1`}
            leading={<ReceiptTextIcon aria-hidden />}
            meta={
              <RecordStatusBadge color={tokens.success}>
                Quitado
              </RecordStatusBadge>
            }
          >
            Parcela 1
          </RecordGroupLink>
          <RecordGroupItem
            leading={<ReceiptTextIcon aria-hidden />}
            title="Parcela 2"
          >
            <span className="truncate text-muted-foreground">10/12/2026</span>
            <RecordStatusBadge>Em aberto</RecordStatusBadge>
          </RecordGroupItem>
        </RecordGroup>
      ))}
    </div>
  ),
}
