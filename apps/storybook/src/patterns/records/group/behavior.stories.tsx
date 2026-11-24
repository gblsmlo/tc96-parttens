import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checklist, RecordGroup } from '@tc96/ui/patterns'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { RecordGroupCanvas } from './record-group-canvas.tsx'
import { recordGroupControlArgs } from './record-group-controls.ts'
import { ComposedRecordGroup } from './record-group-layouts.tsx'

const longTitle =
  'Customer onboarding, compliance review and contract renewal details'

const ignore = () => undefined

interface BehaviorArgs {
  onAction: () => void
}

const meta = {
  args: { onAction: fn() },
  decorators: [RecordGroupCanvas],
  render: ({ onAction }) => (
    <ComposedRecordGroup
      {...recordGroupControlArgs}
      onAction={onAction}
      title={longTitle}
    />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const regionOf = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

const slotIn = (region: HTMLElement, slot: string) =>
  region.querySelector(`[data-slot="${slot}"]`) as HTMLElement

export const TitleWrapsBesideTheActions: Story = {
  play: async ({ args, canvasElement }) => {
    const region = regionOf(canvasElement, longTitle)
    const trigger = within(region).getByRole('button', { name: longTitle })
    const header = slotIn(region, 'record-group-header')
    const action = within(region).getByRole('button', { name: 'Add property' })
    const titleText = trigger.querySelector('span') as HTMLElement

    await expect(titleText.scrollWidth).toBeLessThanOrEqual(
      titleText.clientWidth,
    )
    await expect(titleText.getBoundingClientRect().height).toBeGreaterThan(
      action.getBoundingClientRect().height,
    )
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth)
    await expect(action.getBoundingClientRect().right).toBeLessThanOrEqual(
      header.getBoundingClientRect().right + 0.5,
    )
    await expect(action.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    await expect(args.onAction).not.toHaveBeenCalled()
  },
}

export const FooterSitsBelowTheRows: Story = {
  play: async ({ args, canvasElement }) => {
    const region = regionOf(canvasElement, longTitle)
    const content = slotIn(region, 'record-group-content')
    const footer = slotIn(region, 'record-group-footer')

    await expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      content.getBoundingClientRect().bottom - 0.5,
    )
    await expect(args.onAction).not.toHaveBeenCalled()
  },
}

export const ActionsStayUsableWhenClosed: Story = {
  play: async ({ args, canvasElement }) => {
    const region = regionOf(canvasElement, longTitle)
    const group = within(region)
    const trigger = group.getByRole('button', { name: longTitle })
    const action = group.getByRole('button', { name: 'Add property' })

    await userEvent.click(action)
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
    await expect(action).toBeVisible()
    await userEvent.click(action)
    await expect(args.onAction).toHaveBeenCalledTimes(2)
  },
}

export const FooterLeavesTheTabOrderOnClose: Story = {
  play: async ({ args, canvasElement }) => {
    const region = regionOf(canvasElement, longTitle)
    const group = within(region)
    const trigger = group.getByRole('button', { name: longTitle })
    const panel = slotIn(region, 'collapsible-panel')
    const footerButton = within(panel).getByRole('button', {
      name: 'View history',
    })

    await userEvent.click(trigger)
    await waitFor(() =>
      expect(panel.hasAttribute('data-ending-style')).toBe(true),
    )
    await expect(panel.getAnimations().length).toBeGreaterThan(0)
    await expect(footerButton.closest('[inert]')).not.toBeNull()
    footerButton.focus()
    await expect(document.activeElement).not.toBe(footerButton)

    await waitFor(() => expect(panel.isConnected).toBe(false))
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(
      group.queryByRole('button', { name: 'View history' }),
    ).toBeNull()

    await userEvent.click(trigger)
    await expect(await group.findByText('Owner')).toBeVisible()
    await expect(args.onAction).not.toHaveBeenCalled()
  },
}

export const EmptyOpensWithItsTextAtTheStart: Story = {
  play: async ({ args, canvasElement }) => {
    const region = regionOf(canvasElement, 'Attachments')
    const group = within(region)
    const trigger = group.getByRole('button', { name: 'Attachments' })

    await expect(region).toHaveAttribute('data-empty', 'true')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(group.queryByText('No properties yet')).toBeNull()

    await userEvent.click(trigger)
    const message = await group.findByText('No properties yet')
    const content = slotIn(region, 'record-group-content')
    await waitFor(() => {
      const contentBox = content.getBoundingClientRect()
      const messageBox = message.getBoundingClientRect()
      expect(Math.abs(messageBox.left - contentBox.left)).toBeLessThan(1)
      expect(Math.abs(messageBox.top - contentBox.top)).toBeLessThan(1)
    })
    await expect(args.onAction).not.toHaveBeenCalled()
  },
  render: ({ onAction }) => (
    <ComposedRecordGroup
      {...recordGroupControlArgs}
      empty
      footer={false}
      onAction={onAction}
      title="Attachments"
    />
  ),
}

export const PlainChecklistTakesTheRowHeight: Story = {
  play: async ({ args, canvasElement }) => {
    const group = regionOf(canvasElement, 'Tarefas')
    const items = group.querySelectorAll<HTMLElement>(
      '[data-slot="checklist-item"]',
    )

    await expect(
      within(group).getByRole('region', { name: 'Lista de tarefas' }),
    ).toHaveAttribute('data-variant', 'plain')
    await expect(items).toHaveLength(2)
    for (const item of items) {
      await expect(item.getBoundingClientRect().height).toBe(32)
    }
    await expect(args.onAction).not.toHaveBeenCalled()
  },
  render: () => (
    <RecordGroup title="Tarefas" variant="inset">
      <Checklist
        ariaLabel="Lista de tarefas"
        items={[
          { completed: true, id: 'extracts', title: 'Baixar extratos de 2024' },
          { completed: false, id: 'appeal', title: 'Redigir contestação' },
        ]}
        locale="pt-BR"
        newItemTitle=""
        onCreate={ignore}
        onItemCompletionChange={ignore}
        onItemMove={ignore}
        onItemRename={ignore}
        onNewItemTitleChange={ignore}
        variant="plain"
      />
    </RecordGroup>
  ),
}
