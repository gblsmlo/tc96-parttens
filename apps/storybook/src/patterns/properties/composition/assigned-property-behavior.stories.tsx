import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AssignedProperty,
  type AssignedPropertyOption,
  type AssignedPropertyProps,
} from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

type ExampleAssignee = 'ana' | 'gabriel' | 'marina'

const options: AssignedPropertyOption<ExampleAssignee>[] = [
  {
    fallback: 'AM',
    label: 'Ana Martins',
    supportingLabel: 'Ops',
    value: 'ana',
  },
  {
    fallback: 'GM',
    label: 'Gabriel Melo',
    supportingLabel: 'Owner',
    value: 'gabriel',
  },
  {
    fallback: 'MS',
    label: 'Marina Souza',
    supportingLabel: 'Comercial',
    value: 'marina',
  },
]

const meta = {
  args: { options },
  component: AssignedProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Assigned/Behavior',
} satisfies Meta<typeof AssignedProperty>

export default meta

type Story = StoryObj<AssignedPropertyProps<ExampleAssignee>>

export const ReadOnlyBadge: Story = {
  args: { readOnly: true, value: 'gabriel' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Gabriel Melo')).toBeVisible()
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const ReadOnlyPlain: Story = {
  args: { readOnly: true, value: 'gabriel', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Gabriel Melo')).toBeVisible()
  },
}

export const ListsEveryAssignee: Story = {
  args: {
    ariaLabel: 'Assigned',
    onValueChange: fn(),
    value: 'gabriel',
  },
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
  args: {
    action: fn(),
    ariaLabel: 'Assigned',
    dropdownPlacement: { align: 'end', side: 'bottom' },
    value: 'ana',
  },
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
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}
