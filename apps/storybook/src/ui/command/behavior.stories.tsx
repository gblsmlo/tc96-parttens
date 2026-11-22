import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { commandControlArgs } from './command-controls.ts'
import {
  ComposedCommand,
  DetachedTriggerCommand,
  ShortcutCommand,
} from './command-layouts.tsx'

interface BehaviorArgs {
  onOpenChange: (open: boolean) => void
  onRun: (value: string) => void
}

const { empty, label, trigger } = commandControlArgs

const optionNames = () =>
  screen
    .getAllByRole('option')
    .map(
      (option) =>
        option.firstChild?.textContent ?? option.textContent ?? undefined,
    )

const highlightedNames = () =>
  screen
    .getAllByRole('option')
    .filter((option) => option.hasAttribute('data-highlighted'))
    .map((option) => option.firstChild?.textContent)

const option = (name: RegExp) => screen.getByRole('option', { name })

const search = () => screen.getByRole('combobox', { name: label })

const focusSearch = async () => {
  await userEvent.click(search())
  await expect(search()).toHaveFocus()
}

const openFromTrigger = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: trigger }),
  )
  return screen.findByRole('dialog', { name: label })
}

const closeWithEscape = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const InlineCommand = ({
  disabledItem = false,
  onRun,
  shortcuts = true,
}: {
  disabledItem?: boolean
  onRun?: (value: string) => void
  shortcuts?: boolean
}) => (
  <ComposedCommand
    {...commandControlArgs}
    dialog={false}
    disabledItem={disabledItem}
    onRun={onRun}
    shortcuts={shortcuts}
  />
)

const meta = {
  args: { onOpenChange: fn(), onRun: fn() },
  argTypes: {
    onOpenChange: { control: false },
    onRun: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Command/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCommand
      {...commandControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    const dialog = await screen.findByRole('dialog', { name: label })
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeWithEscape()
  },
}

export const FocusesSearchOnOpen: Story = {
  render: () => <ComposedCommand {...commandControlArgs} defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    const dialog = await openFromTrigger(canvasElement)
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: label }),
      ).toHaveFocus(),
    )
    await closeWithEscape()
  },
}

export const TrapsFocus: Story = {
  render: () => <ComposedCommand {...commandControlArgs} defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    const dialog = await openFromTrigger(canvasElement)
    const field = within(dialog).getByRole('combobox', { name: label })
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(field).toHaveFocus())
    await closeWithEscape()
  },
}

export const EscapeRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCommand
      {...commandControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await openFromTrigger(canvasElement)
    await closeWithEscape()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const ClosesOnOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCommand {...commandControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    await screen.findByRole('dialog', { name: label })
    const viewport = document.querySelector(
      '[data-slot="command-dialog-viewport"]',
    ) as HTMLElement
    await userEvent.click(viewport)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    )
  },
}

export const RunKeepsDialogOpen: Story = {
  render: ({ onOpenChange, onRun }) => (
    <ComposedCommand
      {...commandControlArgs}
      onOpenChange={onOpenChange}
      onRun={onRun}
    />
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: label })
    await userEvent.click(
      within(dialog).getByRole('option', { name: /Calendar/ }),
    )
    await expect(args.onRun).toHaveBeenCalledOnce()
    await expect(dialog).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await closeWithEscape()
  },
}

export const RunClosesControlledDialog: Story = {
  render: ({ onRun }) => <ShortcutCommand defaultOpen onRun={onRun} />,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: label })
    await userEvent.click(
      within(dialog).getByRole('option', { name: /Profile/ }),
    )
    await expect(args.onRun).toHaveBeenCalledWith('profile')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const DetachedTriggerOpens: Story = {
  render: () => <DetachedTriggerCommand />,
  play: async ({ canvasElement }) => {
    await screen.findByRole('dialog', { name: label })
    await closeWithEscape()
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: label })).toBeVisible(),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeWithEscape()
  },
}

export const ShortcutToggles: Story = {
  render: () => <ShortcutCommand />,
  play: async () => {
    await expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.keyboard('{Control>}k{/Control}')
    const dialog = await screen.findByRole('dialog', { name: label })
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: label }),
      ).toHaveFocus(),
    )
    await userEvent.keyboard('{Control>}k{/Control}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const InlineListsWithoutOpening: Story = {
  render: () => <InlineCommand />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(screen.queryByRole('dialog')).toBeNull()
    await expect(canvas.getByRole('listbox')).toBeVisible()
    await expect(canvas.getAllByRole('option')).toHaveLength(6)
  },
}

export const FirstMatchHighlighted: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
    await userEvent.type(search(), 'bil')
    await waitFor(() => expect(highlightedNames()).toEqual(['Billing']))
  },
}

export const FiltersAsYouType: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    await expect(screen.getByRole('group', { name: 'Settings' })).toBeVisible()
    await userEvent.type(search(), 'cal')
    await waitFor(() =>
      expect(optionNames()).toEqual(['Calendar', 'Calculator']),
    )
    await expect(
      screen.getByRole('group', { name: 'Suggestions' }),
    ).toBeVisible()
    await expect(screen.queryByRole('group', { name: 'Settings' })).toBeNull()
  },
}

export const FilterMatchesLabelOnly: Story = {
  render: () => <InlineCommand shortcuts />,
  play: async () => {
    await expect(option(/Profile/)).toHaveTextContent('⌘P')
    await userEvent.type(search(), '⌘P')
    await waitFor(() => expect(screen.queryAllByRole('option')).toHaveLength(0))
  },
}

export const EmptyMessageWhenNothingMatches: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    await expect(screen.queryByText(empty)).toBeNull()
    await userEvent.type(search(), 'weather')
    const status = await screen.findByRole('status')
    await expect(status).toHaveTextContent(empty)
    await expect(status).toHaveAttribute('data-slot', 'command-empty')
    await expect(screen.queryAllByRole('option')).toHaveLength(0)
  },
}

export const MarksEmptyList: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    const list = screen.getByRole('listbox')
    await expect(list).not.toHaveAttribute('data-empty')
    await expect(search()).not.toHaveAttribute('data-list-empty')
    await userEvent.type(search(), 'weather')
    await waitFor(() => expect(list).toHaveAttribute('data-empty'))
    await expect(search()).toHaveAttribute('data-list-empty')
  },
}

export const ArrowKeysMoveHighlight: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    await focusSearch()
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(highlightedNames()).toEqual(['Search emoji']))
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
  },
}

export const ArrowKeysWrap: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    await focusSearch()
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() =>
      expect(highlightedNames()).toEqual(['Keyboard shortcuts']),
    )
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
  },
}

export const EnterRunsHighlighted: Story = {
  render: ({ onRun }) => <InlineCommand onRun={onRun} />,
  play: async ({ args }) => {
    await userEvent.type(search(), 'pro')
    await waitFor(() => expect(highlightedNames()).toEqual(['Profile']))
    await userEvent.keyboard('{Enter}')
    await expect(args.onRun).toHaveBeenCalledOnce()
    await expect(args.onRun).toHaveBeenLastCalledWith('profile')
  },
}

export const ClickRunsItem: Story = {
  render: ({ onRun }) => <InlineCommand onRun={onRun} />,
  play: async ({ args }) => {
    await userEvent.click(option(/Calculator/))
    await expect(args.onRun).toHaveBeenCalledOnce()
    await expect(args.onRun).toHaveBeenLastCalledWith('calculator')
  },
}

export const RunLeavesQuery: Story = {
  render: ({ onRun }) => <InlineCommand onRun={onRun} />,
  play: async ({ args }) => {
    await userEvent.type(search(), 'pro')
    await waitFor(() => expect(highlightedNames()).toEqual(['Profile']))
    await userEvent.keyboard('{Enter}')
    await expect(args.onRun).toHaveBeenCalledOnce()
    await expect(search()).toHaveValue('pro')
  },
}

export const DisabledItemExposed: Story = {
  render: () => <InlineCommand disabledItem />,
  play: async () => {
    await expect(option(/Billing/)).toHaveAttribute('aria-disabled', 'true')
    await expect(option(/Billing/)).toHaveAttribute('data-disabled')
    await expect(option(/Profile/)).not.toHaveAttribute('aria-disabled')
  },
}

export const DisabledItemHighlightable: Story = {
  render: () => <InlineCommand disabledItem />,
  play: async () => {
    await focusSearch()
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await waitFor(() => expect(highlightedNames()).toEqual(['Billing']))
  },
}

export const EnterSkipsDisabledItem: Story = {
  render: ({ onRun }) => <InlineCommand disabledItem onRun={onRun} />,
  play: async ({ args }) => {
    await focusSearch()
    await waitFor(() => expect(highlightedNames()).toEqual(['Calendar']))
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await waitFor(() => expect(highlightedNames()).toEqual(['Billing']))
    await userEvent.keyboard('{Enter}')
    await expect(args.onRun).not.toHaveBeenCalled()
  },
}

export const PressSkipsDisabledItem: Story = {
  render: ({ onRun }) => <InlineCommand disabledItem onRun={onRun} />,
  play: async ({ args }) => {
    const billing = option(/Billing/)
    await expect(getComputedStyle(billing).pointerEvents).toBe('none')
    billing.click()
    await expect(args.onRun).not.toHaveBeenCalled()
  },
}

export const GroupsNamedByLabel: Story = {
  render: () => <InlineCommand />,
  play: async () => {
    for (const [name, first] of [
      ['Suggestions', 'Calendar'],
      ['Settings', 'Profile'],
    ] as const) {
      const group = screen.getByRole('group', { name })
      await expect(
        within(group).getAllByRole('option')[0]?.firstChild?.textContent,
      ).toBe(first)
    }
  },
}
