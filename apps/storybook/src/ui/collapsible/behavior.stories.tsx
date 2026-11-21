import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { collapsibleControlArgs } from './collapsible-controls.ts'
import { CollapsibleCanvas } from './collapsible-frame.tsx'
import { ComposedCollapsible } from './collapsible-layouts.tsx'

interface BehaviorArgs {
  onOpenChange: (open: boolean) => void
}

const { content, trigger } = collapsibleControlArgs

const slotOf = (canvasElement: HTMLElement, slot: string) =>
  canvasElement.querySelector(`[data-slot="${slot}"]`) as HTMLElement | null

const meta = {
  args: { onOpenChange: fn() },
  argTypes: { onOpenChange: { control: false } },
  decorators: [CollapsibleCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Collapsible/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const TogglesOnPress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCollapsible
      {...collapsibleControlArgs}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: trigger })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(content)).toBeNull()
    await userEvent.click(button)
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const panel = slotOf(canvasElement, 'collapsible-panel') as HTMLElement
    await expect(button).toHaveAttribute('aria-controls', panel.id)
    await waitFor(() => expect(canvas.getByText(content)).toBeVisible())
    await userEvent.click(button)
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(canvas.queryByText(content)).toBeNull())
  },
}

export const KeyboardToggle: Story = {
  render: () => <ComposedCollapsible {...collapsibleControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: trigger })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(canvas.getByText(content)).toBeVisible())
    await userEvent.keyboard(' ')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(canvas.queryByText(content)).toBeNull())
  },
}

export const StateAttributes: Story = {
  render: () => <ComposedCollapsible {...collapsibleControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = slotOf(canvasElement, 'collapsible') as HTMLElement
    const button = slotOf(canvasElement, 'collapsible-trigger') as HTMLElement
    await expect(root).toHaveAttribute('data-closed')
    await expect(root).not.toHaveAttribute('data-open')
    await expect(button).not.toHaveAttribute('data-panel-open')
    await userEvent.click(button)
    await expect(root).toHaveAttribute('data-open')
    await expect(root).not.toHaveAttribute('data-closed')
    await expect(button).toHaveAttribute('data-panel-open')
    await waitFor(() =>
      expect(slotOf(canvasElement, 'collapsible-panel')).toHaveAttribute(
        'data-open',
      ),
    )
  },
}

export const OpenOnFirstRender: Story = {
  render: () => <ComposedCollapsible {...collapsibleControlArgs} defaultOpen />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: trigger })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await expect(canvas.getByText(content)).toBeVisible()
  },
}

export const HeightFollowsContent: Story = {
  render: () => <ComposedCollapsible {...collapsibleControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: trigger }))
    const panel = slotOf(canvasElement, 'collapsible-panel') as HTMLElement
    await waitFor(() =>
      expect(panel.getBoundingClientRect().height).toBeCloseTo(
        panel.scrollHeight,
        0,
      ),
    )
    await waitFor(() =>
      expect(panel.style.getPropertyValue('--collapsible-panel-height')).toBe(
        'auto',
      ),
    )
  },
}

export const DisabledIgnoresPress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCollapsible
      {...collapsibleControlArgs}
      disabled
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: trigger })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await userEvent.click(button)
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(content)).toBeNull()
  },
}

export const DisabledMarksEveryPart: Story = {
  render: () => <ComposedCollapsible {...collapsibleControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(button).toHaveAttribute('data-disabled')
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    await expect(button).not.toHaveAttribute('disabled')
    await expect(slotOf(canvasElement, 'collapsible')).toHaveAttribute(
      'data-disabled',
    )
  },
}

export const ControlledOpen: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCollapsible
      {...collapsibleControlArgs}
      onOpenChange={onOpenChange}
      open={false}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: trigger }))
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(canvas.queryByText(content)).toBeNull()
    await expect(canvas.getByRole('button', { name: trigger })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  },
}

export const KeepMounted: Story = {
  render: () => <ComposedCollapsible {...collapsibleControlArgs} keepMounted />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const panel = slotOf(canvasElement, 'collapsible-panel') as HTMLElement
    await expect(panel).toHaveAttribute('hidden')
    await expect(canvas.getByText(content)).not.toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: trigger }))
    await waitFor(() => expect(canvas.getByText(content)).toBeVisible())
    await expect(slotOf(canvasElement, 'collapsible-panel')).toBe(panel)
  },
}

export const FoundByPageSearch: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCollapsible
      {...collapsibleControlArgs}
      hiddenUntilFound
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const panel = slotOf(canvasElement, 'collapsible-panel') as HTMLElement
    await expect(panel).toHaveAttribute('hidden', 'until-found')
    panel.dispatchEvent(new Event('beforematch', { bubbles: true }))
    await waitFor(() =>
      expect(args.onOpenChange).toHaveBeenCalledWith(true, expect.anything()),
    )
    await waitFor(() => expect(canvas.getByText(content)).toBeVisible())
    await expect(canvas.getByRole('button', { name: trigger })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  },
}
