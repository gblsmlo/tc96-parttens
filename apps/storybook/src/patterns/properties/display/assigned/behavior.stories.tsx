import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssignedProperty, AssignedPropertyBadge } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { assignees } from './assigned-controls'

interface BehaviorArgs {
  action: (value: unknown, context: unknown) => void
  onValueChange: (value: unknown) => void
}

const meta = {
  args: { action: fn(), onValueChange: fn() },
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Assigned/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const closeList = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

export const ReadOnlyRendersNoCombobox: Story = {
  render: ({ onValueChange }) => (
    <AssignedProperty
      onValueChange={onValueChange}
      options={assignees}
      readOnly
      value="gabriel"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Responsável: Gabriel Melo' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('combobox')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const WithoutHandlerIsReadOnly: Story = {
  render: () => <AssignedProperty options={assignees} value="ana" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Responsável: Ana Martins' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const BadgeSurfaceIsFilled: Story = {
  render: () => (
    <AssignedProperty options={assignees} readOnly value="gabriel" />
  ),
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainSurfaceHasNoFill: Story = {
  render: () => (
    <AssignedProperty
      options={assignees}
      readOnly
      value="gabriel"
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Gabriel Melo')).toBeVisible()
    await esperarSuperficiePlana(canvasElement)
  },
}

export const DefaultsNameTheEmptyValue: Story = {
  render: ({ onValueChange }) => (
    <AssignedProperty
      onValueChange={onValueChange}
      options={assignees}
      value={null}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Responsável: Sem responsável',
    })

    await expect(trigger).toHaveTextContent('Sem responsável')
    await expect(trigger.dataset.empty).toBe('true')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ListsEveryAssignee: Story = {
  render: ({ onValueChange }) => (
    <AssignedProperty
      ariaLabel="Assigned"
      onValueChange={onValueChange}
      options={assignees}
      value="gabriel"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Assigned: Gabriel Melo',
      }),
    )

    await expect(
      await screen.findByRole('option', { name: 'Ana Martins' }),
    ).toBeVisible()
    await expect(
      screen
        .getByRole('option', { name: 'Gabriel Melo' })
        .querySelector(':scope > span'),
    ).not.toBeNull()
    await expect(
      screen.getByRole('option', { name: 'Marina Souza' }),
    ).toBeVisible()

    await userEvent.click(screen.getByRole('option', { name: 'Marina Souza' }))

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith('marina')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const ActionReceivesPreviousValue: Story = {
  render: ({ action, onValueChange }) => (
    <AssignedProperty
      action={action}
      ariaLabel="Assigned"
      dropdownPlacement={{ align: 'end', side: 'bottom' }}
      onValueChange={onValueChange}
      options={assignees}
      value="ana"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Assigned: Ana Martins',
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Gabriel Melo' }),
    )

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(
      'gabriel',
      expect.objectContaining({
        option: expect.objectContaining({ label: 'Gabriel Melo' }),
        previousValue: 'ana',
      }),
    )
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const PickingTheCurrentValueEmitsNothing: Story = {
  render: ({ onValueChange }) => (
    <AssignedProperty
      onValueChange={onValueChange}
      options={assignees}
      value="gabriel"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Responsável: Gabriel Melo',
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Gabriel Melo' }),
    )

    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DisabledDoesNotOpen: Story = {
  render: ({ onValueChange }) => (
    <AssignedProperty
      disabled
      onValueChange={onValueChange}
      options={assignees}
      value="gabriel"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Responsável: Gabriel Melo',
    })

    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })

    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const KeyboardOpensTheList: Story = {
  render: ({ onValueChange }) => (
    <AssignedProperty
      onValueChange={onValueChange}
      options={assignees}
      value="gabriel"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Responsável: Gabriel Melo',
    })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    await expect(
      await screen.findByRole('option', { name: 'Marina Souza' }),
    ).toBeVisible()
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await closeList()
  },
}

export const BadgeShowsThePlaceholderWithoutOption: Story = {
  render: () => <AssignedPropertyBadge option={null} />,
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-surface"]',
    )

    await expect(surface).toHaveTextContent('Sem responsável')
    await expect(surface?.dataset.empty).toBe('true')
    await expect(within(canvasElement).queryByRole('combobox')).toBeNull()
  },
}
