import { PlusIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty, type PersonPropertyOption } from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { isIcon } from '../../../../test-utils/is-icon'
import { esperarAvatarComAresta } from '../../../../test-utils/property-surface'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { PeopleCanvas } from './people-canvas.tsx'
import { peopleControlArgs } from './people-controls.ts'
import { ComposedPeople } from './people-layouts.tsx'

const options: PersonPropertyOption<string>[] = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
]

const meta = {
  args: {
    ariaLabel: 'Participantes da tarefa',
    onValueChange: fn(),
    options,
    value: ['person-1'],
    placeholder: 'Adicionar pessoa',
    labels: ptBRPropertyLabels.people,
  },
  component: PeopleProperty,
  decorators: [PeopleCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/People/Behavior',
} satisfies Meta<typeof PeopleProperty>

export default meta

type Story = StoryObj<typeof meta>

const addChip = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Adicionar pessoa' })

const openList = async (canvasElement: HTMLElement) => {
  await userEvent.click(addChip(canvasElement))
  return screen.findByRole('listbox', { name: 'Participantes da tarefa' })
}

const pickAnaSouza = async (canvasElement: HTMLElement) => {
  await openList(canvasElement)
  await userEvent.click(
    await screen.findByRole('option', { name: /Ana Souza/ }),
  )
}

const positionerAlign = () =>
  document.querySelector<HTMLElement>('[data-slot="combobox-positioner"]')
    ?.dataset.align

const closeList = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

export const EmptyTriggerShowsPlaceholderLast: Story = {
  args: { value: [] },
  play: async ({ canvasElement }) => {
    const trigger = addChip(canvasElement)

    await expect(trigger.textContent).toBe('Adicionar pessoa')
    await expect(trigger).toHaveAttribute('data-empty', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="combobox-chips"]')
        ?.lastElementChild,
    ).toBe(trigger)
  },
}

export const TriggerShrinksToPlus: Story = {
  args: { placeholder: 'Convidar' },
  play: async ({ canvasElement }) => {
    const trigger = addChip(canvasElement)

    await expect(trigger.textContent).toBe('')
    await expect(isIcon(trigger.querySelector('svg'), PlusIcon)).toBe(true)
  },
}

export const AppliedPersonIsAvatarAndNameChip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const chip = canvas
      .getByText('Bruno Lima')
      .closest<HTMLElement>('[data-slot="combobox-chip"]')
    if (!chip) throw new Error('The story did not render the chip.')

    await expect(chip.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      'data-size',
      'xs',
    )
    await esperarAvatarComAresta(chip, 16)
    await expect(
      within(chip).getByRole('button', { name: 'Remover Bruno Lima' }),
    ).toBeInTheDocument()
  },
}

export const OptionsUseSmAvatar: Story = {
  play: async ({ canvasElement }) => {
    await openList(canvasElement)
    const option = await screen.findByRole('option', { name: /Ana Souza/ })

    await expect(option.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      'data-size',
      'sm',
    )
    await esperarAvatarComAresta(option, 24)

    await closeList()
  },
}

export const LoadingShowsStatusInList: Story = {
  args: { isLoading: true },
  play: async ({ canvasElement }) => {
    await openList(canvasElement)

    await expect(await screen.findByText('Carregando pessoas…')).toBeVisible()

    await closeList()
  },
}

export const SelectingReturnsNextCollection: Story = {
  play: async ({ args, canvasElement }) => {
    await pickAnaSouza(canvasElement)

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      'person-1',
      'person-2',
    ])

    await closeList()
  },
}

export const PickingAppliedPersonRemovesThem: Story = {
  play: async ({ args, canvasElement }) => {
    await openList(canvasElement)
    await userEvent.click(
      await screen.findByRole('option', { name: /Bruno Lima/ }),
    )

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith([])

    await closeList()
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

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['person-2'])
  },
}

export const ActionGetsAddedAndRemoved: Story = {
  args: { action: fn(), onValueChange: undefined },
  render: function People({ action, ...args }) {
    const [value, setValue] = useState(args.value)

    return (
      <PeopleProperty
        ariaLabel="Pessoas"
        placeholder="Adicionar pessoa"
        {...args}
        action={(next, context) => {
          action?.(next, context)
          setValue(next)
        }}
        value={value}
        labels={{ ...ptBRPropertyLabels.people, ...args.labels }}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    await pickAnaSouza(canvasElement)
    await closeList()
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
  args: { onValueChange: undefined, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Bruno Lima')).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const ReadOnlyUsesXsAvatar: Story = {
  args: { onValueChange: undefined, readOnly: true },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="avatar"]'),
    ).toHaveAttribute('data-size', 'xs')
    await esperarAvatarComAresta(canvasElement, 16)
  },
}

export const ReadOnlyEmptyShowsPlaceholder: Story = {
  args: { onValueChange: undefined, readOnly: true, value: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Adicionar pessoa'),
    ).toBeVisible()
  },
}

export const DropdownAlignsToStart: Story = {
  args: { dropdownPlacement: { align: 'start' } },
  play: async ({ args, canvasElement }) => {
    await openList(canvasElement)

    await waitFor(() => expect(positionerAlign()).toBe('start'))

    await closeList()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ChipsMatchTheAddSurface: Story = {
  play: async ({ canvasElement }) => {
    const chip = canvasElement.querySelector<HTMLElement>(
      '[data-slot="combobox-chip"]',
    )
    if (!chip) throw new Error('The story did not render the chip.')
    const chipStyle = getComputedStyle(chip)
    const addStyle = getComputedStyle(addChip(canvasElement))

    await expect(chipStyle.fontSize).toBe('14px')
    await expect(chipStyle.fontSize).toBe(addStyle.fontSize)
    await expect(chipStyle.borderTopLeftRadius).not.toBe('0px')
    await expect(chipStyle.borderTopLeftRadius).toBe(
      addStyle.borderTopLeftRadius,
    )
  },
}

export const PlainChipsShowNoFocusRing: Story = {
  play: async ({ args, canvasElement }) => {
    const chips = canvasElement.querySelector<HTMLElement>(
      '[data-slot="combobox-chips"]',
    )
    if (!chips) throw new Error('The story did not render the chips.')

    await pickAnaSouza(canvasElement)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

    await waitFor(() => expect(chips.matches(':focus-within')).toBe(true))
    await expect(getComputedStyle(chips).boxShadow).not.toContain('3px')
    await expect(args.onValueChange).toHaveBeenCalledOnce()
  },
}

const TRANSPARENT = 'rgba(0, 0, 0, 0)'

const chipsOf = (canvasElement: HTMLElement) => {
  const chips = canvasElement.querySelector<HTMLElement>(
    '[data-slot="combobox-chips"]',
  )
  if (!chips) throw new Error('The story did not render the chips.')
  return chips
}

export const PlainByDefaultHasNoFrame: Story = {
  render: () => <ComposedPeople {...peopleControlArgs} />,
  play: async ({ canvasElement }) => {
    const chips = getComputedStyle(chipsOf(canvasElement))

    await expect(
      canvasElement.querySelector('[data-slot="people-property"]'),
    ).toHaveAttribute('data-variant', 'plain')
    await expect(chips.backgroundColor).toBe(TRANSPARENT)
    await expect(chips.borderTopColor).toBe(TRANSPARENT)
  },
}

export const BadgeFramesTheChips: Story = {
  render: () => <ComposedPeople {...peopleControlArgs} variant="badge" />,
  play: async ({ canvasElement }) => {
    const chips = getComputedStyle(chipsOf(canvasElement))

    await expect(
      canvasElement.querySelector('[data-slot="people-property"]'),
    ).toHaveAttribute('data-variant', 'badge')
    await expect(chips.borderTopWidth).toBe('1px')
    await expect(chips.borderTopColor).not.toBe(TRANSPARENT)
  },
}

export const DisabledBlocksAddingAndRemoving: Story = {
  render: () => <ComposedPeople {...peopleControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(addChip(canvasElement)).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Remover Bruno Lima' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}
