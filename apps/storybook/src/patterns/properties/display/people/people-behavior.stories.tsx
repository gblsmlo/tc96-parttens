import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty, type PeoplePropertyOption } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

const options: PeoplePropertyOption<string>[] = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
]

const meta = {
  args: {
    ariaLabel: 'Participantes da tarefa',
    onValueChange: fn(),
    options,
    value: ['person-1'],
  },
  component: PeopleProperty,
  decorators: [
    (Story) => (
      <div className="min-h-72 max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/People/Behavior',
} satisfies Meta<typeof PeopleProperty>

export default meta

type Story = StoryObj<typeof meta>

const pickAnaSouza = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Adicionar pessoa' }),
  )
  await userEvent.click(
    await screen.findByRole('option', { name: /Ana Souza/ }),
  )
}

export const LabelledChipOpensEditing: Story = {
  args: { value: [] },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar pessoa',
    })

    await expect(trigger.textContent).toContain('Adicionar pessoa')
    await expect(
      canvasElement.querySelector('[data-slot="combobox-chips"]')
        ?.lastElementChild,
    ).toBe(trigger)
  },
}

export const TriggerShrinksToPlus: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar pessoa',
    })

    await expect(
      trigger.querySelector('svg')?.classList.contains('lucide-plus'),
    ).toBe(true)
  },
}

export const AppliedPersonIsAvatarAndNameChip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Bruno Lima')).toBeInTheDocument()
    await expect(
      canvasElement
        .querySelector('[data-slot="avatar"]')
        ?.getAttribute('data-size'),
    ).toBe('xs')
    await expect(
      canvas.getByRole('button', { name: 'Remover Bruno Lima' }),
    ).toBeInTheDocument()
  },
}

export const OptionsUseSmAvatar: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar pessoa' }),
    )
    const option = await screen.findByRole('option', { name: /Ana Souza/ })

    await expect(
      option.querySelector('[data-slot="avatar"]')?.getAttribute('data-size'),
    ).toBe('sm')
  },
}

export const ReadOnlyUsesXsAvatar: Story = {
  args: { ariaLabel: undefined, onValueChange: undefined, readOnly: true },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement
        .querySelector('[data-slot="avatar"]')
        ?.getAttribute('data-size'),
    ).toBe('xs')
  },
}

export const SelectingReturnsNextCollection: Story = {
  play: async ({ args, canvasElement }) => {
    await pickAnaSouza(canvasElement)

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith([
      'person-1',
      'person-2',
    ])
  },
}

export const RemovingReturnsNextCollection: Story = {
  args: { value: ['person-1', 'person-2'] },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Remover Bruno Lima',
      }),
    )

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith(['person-2'])
  },
}

export const ActionGetsAddedAndRemoved: Story = {
  args: { action: fn(), ariaLabel: undefined, onValueChange: undefined },
  render: function People({ action, ...args }) {
    const [value, setValue] = useState(args.value)

    return (
      <PeopleProperty
        {...args}
        action={(next, context) => {
          action?.(next, context)
          setValue(next)
        }}
        value={value}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    await pickAnaSouza(canvasElement)
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Remover Bruno Lima',
      }),
    )

    await expect(args.action).toHaveBeenCalledTimes(2)
    await expect(args.action).toHaveBeenNthCalledWith(
      1,
      ['person-1', 'person-2'],
      { added: options[1], previousValue: ['person-1'], removed: null },
    )
    await expect(args.action).toHaveBeenNthCalledWith(2, ['person-2'], {
      added: null,
      previousValue: ['person-1', 'person-2'],
      removed: options[0],
    })
  },
}

export const ReadOnlyHasNoEditingControls: Story = {
  args: { ariaLabel: undefined, onValueChange: undefined, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Bruno Lima')).toBeInTheDocument()
    await expect(canvas.queryByRole('combobox')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Remover Bruno Lima' }),
    ).toBeNull()
  },
}

export const ReadOnlyEmptyShowsPlaceholder: Story = {
  args: {
    ariaLabel: undefined,
    onValueChange: undefined,
    readOnly: true,
    value: [],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Adicionar pessoa'),
    ).toBeInTheDocument()
  },
}
