import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty, type TagsPropertyOption } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { esperarIndicadorADireita } from '../../../../test-utils/property-surface'
import { TagsCanvas } from './tags-canvas.tsx'
import { placementsCountLabel } from './tags-data.ts'

const options: TagsPropertyOption[] = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
]

const meta = {
  args: {
    ariaLabel: 'Tags da tarefa',
    onValueChange: fn(),
    options,
    value: ['documents'],
  },
  component: TagsProperty,
  decorators: [TagsCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Behavior',
} satisfies Meta<typeof TagsProperty>

export default meta

type Story = StoryObj<typeof meta>

const TRANSPARENT = 'rgba(0, 0, 0, 0)'

const tagsProperty = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="tags-property"]')

const chipsOf = (canvasElement: HTMLElement) => {
  const chips = canvasElement.querySelector<HTMLElement>(
    '[data-slot="combobox-chips"]',
  )
  if (!chips) throw new Error('The story did not render the chips.')
  return chips
}

const addChip = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Adicionar tag' })

const closeList = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

const countTriggers = (args: Story['args']) => (
  <div className="flex flex-col items-start gap-2">
    <TagsProperty {...args} options={options} value={[]} />
    <TagsProperty {...args} options={options} value={['documents']} />
    <TagsProperty {...args} options={options} value={['documents', 'return']} />
  </div>
)

export const PlainByDefaultHasNoFrame: Story = {
  play: async ({ canvasElement }) => {
    const chips = getComputedStyle(chipsOf(canvasElement))

    await expect(tagsProperty(canvasElement)?.dataset.variant).toBe('plain')
    await expect(chips.backgroundColor).toBe(TRANSPARENT)
    await expect(chips.borderTopColor).toBe(TRANSPARENT)
  },
}

export const TagsAreSquareCornerChips: Story = {
  play: async ({ canvasElement }) => {
    const tag = canvasElement.querySelector<HTMLElement>(
      '[data-slot="combobox-chip"]',
    )
    if (!tag) throw new Error('The story did not render a tag.')

    await expect(tag).toHaveTextContent('Documentos')
    await expect(getComputedStyle(tag).fontSize).toBe('14px')
    await expect(
      Number.parseFloat(getComputedStyle(tag).borderTopLeftRadius),
    ).toBeLessThan(tag.getBoundingClientRect().height / 2)
    await expect(
      within(tag).getByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeVisible()
  },
}

export const EmptyAddChipShowsTagIconLast: Story = {
  args: { value: [] },
  play: async ({ canvasElement }) => {
    const trigger = addChip(canvasElement)

    await expect(trigger.textContent).toBe('Adicionar tag')
    await expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    await expect(trigger.querySelector('svg')).toHaveClass('lucide-tag')
    await expect(chipsOf(canvasElement).lastElementChild).toBe(trigger)
  },
}

export const AddChipShrinksToPlusSquare: Story = {
  play: async ({ canvasElement }) => {
    const trigger = addChip(canvasElement)
    const size = trigger.getBoundingClientRect()

    await expect(trigger.textContent).toBe('')
    await expect(trigger.querySelector('svg')).toHaveClass('lucide-plus')
    await expect(size.width).toBe(24)
    await expect(size.height).toBe(24)
  },
}

export const AddChipOpensListWithoutSearchField: Story = {
  args: { value: [] },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(addChip(canvasElement))

    await expect(
      await screen.findByRole('option', { name: 'Documentos' }),
    ).toBeVisible()
    await expect(
      screen.queryByRole('combobox', { name: 'Tags da tarefa' }),
    ).toBeNull()

    await closeList()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ListIsAsWideAsItsOptions: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(addChip(canvasElement))
    await screen.findByRole('option', { name: 'Documentos' })
    const popup = document.querySelector<HTMLElement>(
      '[data-slot="combobox-positioner"] > span',
    )

    await expect(popup).toHaveClass('w-max')
    await expect(popup).toHaveClass('min-w-0!')

    await closeList()
  },
}

export const SelectingReturnsNextCollection: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(addChip(canvasElement))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retorno' }),
    )

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      'documents',
      'return',
    ])

    await closeList()
  },
}

export const ActionGetsAddedOptionInsteadOfOnValueChange: Story = {
  args: { action: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(addChip(canvasElement))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retorno' }),
    )

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith(
      ['documents', 'return'],
      { added: options[1], previousValue: ['documents'], removed: null },
    )

    await closeList()
  },
}

export const DisabledBlocksAdding: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    await expect(addChip(canvasElement)).toBeDisabled()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ReadOnlyKeepsEditingControlsOut: Story = {
  args: { onValueChange: undefined, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Documentos')).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const ReadOnlyEmptyShowsPlaceholder: Story = {
  args: { onValueChange: undefined, readOnly: true, value: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Adicionar uma tag'),
    ).toBeVisible()
  },
}

export const CountShowsOnlyTheCount: Story = {
  args: { display: 'count', variant: 'badge' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', {
      name: 'Tags da tarefa: 1 Tag',
    })

    await expect(trigger.textContent).toBe('1 Tag')
    await expect(canvas.queryByText('Documentos')).toBeNull()
    await expect(tagsProperty(canvasElement)?.dataset.display).toBe('count')
  },
}

export const CountIsEmptyOnlyAtZero: Story = {
  args: { display: 'count', variant: 'badge' },
  render: countTriggers,
  play: async ({ canvasElement }) => {
    const trigger = (name: string) =>
      within(canvasElement).getByRole('button', { name })
    const none = trigger('Tags da tarefa: 0 Tags')

    await expect(none.textContent).toBe('0 Tags')
    await expect(none).toHaveAttribute('data-empty', 'true')
    await expect(none.getBoundingClientRect().height).toBe(24)
    await expect(trigger('Tags da tarefa: 1 Tag').textContent).toBe('1 Tag')
    await expect(trigger('Tags da tarefa: 1 Tag')).not.toHaveAttribute(
      'data-empty',
    )
    await expect(trigger('Tags da tarefa: 2 Tags').textContent).toBe('2 Tags')
  },
}

export const CountOpensListBelowTrigger: Story = {
  args: { display: 'count', variant: 'badge' },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Tags da tarefa: 1 Tag',
    })
    await userEvent.click(trigger)
    const option = await screen.findByRole('option', { name: 'Documentos' })

    await waitFor(() =>
      expect(option.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().bottom,
      ),
    )

    await closeList()
  },
}

export const KeyboardReachesAddChipAndOpensList: Story = {
  play: async ({ canvasElement }) => {
    const trigger = addChip(canvasElement)
    for (let step = 0; step < 4 && document.activeElement !== trigger; step++) {
      await userEvent.tab()
    }
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    await expect(
      await screen.findByRole('option', { name: 'Retorno' }),
    ).toBeVisible()

    await closeList()
  },
}

export const SelectedOptionCheckOnTheRight: Story = {
  args: { display: 'count', variant: 'badge' },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Tags da tarefa: 1 Tag',
      }),
    )
    const option = await screen.findByRole('option', { name: 'Documentos' })
    await waitFor(() => expect(option).toBeVisible())

    await esperarIndicadorADireita(option)

    await closeList()
  },
}

export const CountPlainKeepsTextSizeAndIcon: Story = {
  args: { display: 'count' },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Tags da tarefa: 1 Tag',
    })
    const icon = trigger.querySelector('svg')

    await expect(trigger.dataset.variant).toBe('plain')
    await expect(getComputedStyle(trigger).fontSize).toBe('14px')
    await expect(icon?.getBoundingClientRect().width).toBe(12)
    await expect(icon?.getBoundingClientRect().height).toBe(12)
  },
}

export const CountLabelNamesTheTrigger: Story = {
  args: {
    ariaLabel: 'Posicionamentos',
    countLabel: placementsCountLabel,
    display: 'count',
    variant: 'badge',
  },
  render: countTriggers,
  play: async ({ canvasElement }) => {
    const trigger = (name: string) =>
      within(canvasElement).getByRole('button', { name })

    await expect(
      trigger('Posicionamentos: 0 posicionamentos').textContent,
    ).toBe('0 posicionamentos')
    await expect(trigger('Posicionamentos: 1 posicionamento').textContent).toBe(
      '1 posicionamento',
    )
    await expect(
      trigger('Posicionamentos: 2 posicionamentos').textContent,
    ).toBe('2 posicionamentos')
  },
}

export const CountLabelOnReadOnlySurface: Story = {
  args: {
    ariaLabel: 'Posicionamentos',
    countLabel: placementsCountLabel,
    display: 'count',
    onValueChange: undefined,
    readOnly: true,
    value: ['documents', 'return'],
    variant: 'badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('2 posicionamentos')).toBeVisible()
    await expect(canvas.queryByText('2 Tags')).toBeNull()
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}
