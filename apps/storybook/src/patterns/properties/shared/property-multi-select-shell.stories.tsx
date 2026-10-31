import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty, TagsProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const documents = { label: 'Documentos', value: 'documents' }
const returns = { label: 'Retorno', value: 'return' }
const options = [documents, returns]

const people = [
  { fallback: 'AM', label: 'Ana Martins', value: 'ana' },
  { fallback: 'GM', label: 'Gabriel Melo', value: 'gabriel' },
]

const action = fn()

const positionerAlign = () =>
  document.querySelector<HTMLElement>('[data-slot="combobox-positioner"]')
    ?.dataset.align

const closeList = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

const meta = {
  decorators: [
    (Story) => (
      <div className="flex min-h-64 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Shared/Multi Select Shell',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EmptyAddChipNamesItselfWithPlaceholder: Story = {
  render: () => (
    <PeopleProperty
      onValueChange={() => undefined}
      options={people}
      placeholder="Adicionar responsável"
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar responsável',
    })
    const icon = trigger.querySelector('svg')

    await expect(trigger.textContent).toBe('Adicionar responsável')
    await expect(icon?.classList.contains('lucide-user-plus')).toBe(true)
    await expect(trigger.getAttribute('data-slot')).toBe('property-surface')
    await expect(trigger.getAttribute('data-empty')).toBe('true')
    await expect(icon?.classList.contains('size-3')).toBe(true)
    await expect(icon?.getBoundingClientRect().width).toBe(12)
    await expect(
      canvasElement
        .querySelector('[data-slot="combobox-chips"]')
        ?.classList.contains('focus-within:ring-0'),
    ).toBe(true)
  },
}

export const EmptyAddChipShowsAddIcon: Story = {
  render: () => (
    <TagsProperty
      onValueChange={() => undefined}
      options={options}
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar tag',
    })

    await expect(trigger.textContent).toBe('Adicionar tag')
    await expect(
      trigger.querySelector('svg')?.classList.contains('lucide-tag'),
    ).toBe(true)
  },
}

export const ValuesNameRemovalAndCollapseAddChip: Story = {
  render: () => (
    <TagsProperty
      onValueChange={() => undefined}
      options={options}
      value={['documents']}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeVisible()
    const trigger = canvas.getByRole('button', { name: 'Adicionar tag' })
    await expect(trigger.textContent).toBe('')
    await expect(trigger.className).toContain('w-6')
    await expect(trigger.getBoundingClientRect().width).toBe(24)
    await expect(trigger.hasAttribute('data-empty')).toBe(false)
  },
}

export const ReportsAddedOption: Story = {
  render: () => (
    <TagsProperty action={action} options={options} value={['documents']} />
  ),
  play: async ({ canvasElement }) => {
    action.mockClear()

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retorno' }),
    )

    await expect(action).toHaveBeenCalledTimes(1)
    await expect(action).toHaveBeenCalledWith(['documents', 'return'], {
      added: returns,
      previousValue: ['documents'],
      removed: null,
    })
    await closeList()
  },
}

export const ReportsRemovedOption: Story = {
  render: () => (
    <TagsProperty
      action={action}
      options={options}
      value={['documents', 'return']}
    />
  ),
  play: async ({ canvasElement }) => {
    action.mockClear()

    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Remover tag Retorno',
      }),
    )

    await expect(action).toHaveBeenCalledTimes(1)
    await expect(action).toHaveBeenCalledWith(['documents'], {
      added: null,
      previousValue: ['documents', 'return'],
      removed: returns,
    })
  },
}

export const CustomTriggerReplacesChips: Story = {
  render: () => (
    <TagsProperty
      display="count"
      onValueChange={() => undefined}
      options={options}
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Adicionar tag' }),
    ).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Tags: 0 Tags' }))

    await expect(
      await screen.findByRole('option', { name: 'Documentos' }),
    ).toBeInTheDocument()
    await closeList()
  },
}

export const AlignsToEndByDefault: Story = {
  render: () => (
    <div className="flex w-full justify-end">
      <TagsProperty
        className="w-auto"
        onValueChange={() => undefined}
        options={options}
        value={[]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await screen.findByRole('option', { name: 'Documentos' })

    await expect(positionerAlign()).toBe('end')
    await closeList()
  },
}

export const PlacementOverridesAlign: Story = {
  render: () => (
    <TagsProperty
      dropdownPlacement={{ align: 'start' }}
      onValueChange={() => undefined}
      options={options}
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await screen.findByRole('option', { name: 'Documentos' })

    await expect(positionerAlign()).toBe('start')
    await closeList()
  },
}

export const LoadingAndEmptyLabels: Story = {
  render: () => (
    <TagsProperty
      isLoading
      onValueChange={() => undefined}
      options={[]}
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )

    await expect(
      await screen.findByText('Carregando tags…'),
    ).toBeInTheDocument()
    await expect(
      screen.getByText('Nenhuma tag encontrada.'),
    ).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByText('Carregando tags…')).toBeNull(),
    )
  },
}
