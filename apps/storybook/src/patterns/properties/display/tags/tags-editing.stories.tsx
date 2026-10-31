import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty, type TagsPropertyOption } from '@tc96/parttens'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

const options: TagsPropertyOption[] = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
]

const meta = {
  args: { onValueChange: fn(), options, value: ['documents'] },
  component: TagsProperty,
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Editing',
} satisfies Meta<typeof TagsProperty>

export default meta

type Story = StoryObj<typeof meta>

const tagsProperty = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="tags-property"]')

export const EditablePlainProperty: Story = {
  args: { ariaLabel: 'Tags da tarefa', variant: 'plain' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Adicionar tag' }),
    ).toBeInTheDocument()
    await expect(canvas.getByText('Documentos')).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeInTheDocument()
    await expect(tagsProperty(canvasElement)?.dataset.variant).toBe('plain')
    await expect(
      canvasElement.querySelector('[data-slot="combobox-chips"]')?.className,
    ).toContain('bg-transparent!')
  },
}

export const PlainIsTheDefaultVariant: Story = {
  play: async ({ canvasElement }) => {
    await expect(tagsProperty(canvasElement)?.dataset.variant).toBe('plain')
  },
}

export const TagsAreCossChips: Story = {
  play: async ({ canvasElement }) => {
    const tag = canvasElement.querySelector('[data-slot="combobox-chip"]')

    await expect(tag).toHaveTextContent('Documentos')
    await expect(tag?.className).not.toContain('rounded-full')
  },
}

export const SelectingReturnsNextCollection: Story = {
  args: { ariaLabel: 'Tags da tarefa' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retorno' }),
    )

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith([
      'documents',
      'return',
    ])
  },
}

export const ActionGetsAddedOptionInsteadOfOnValueChange: Story = {
  args: { action: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retorno' }),
    )

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(['documents', 'return'], {
      added: options[1],
      previousValue: ['documents'],
      removed: null,
    })
  },
}

export const ActionGetsRemovedOption: Story = {
  args: {
    action: fn(),
    onValueChange: undefined,
    value: ['documents', 'return'],
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Remover tag Documentos',
      }),
    )

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(['return'], {
      added: null,
      previousValue: ['documents', 'return'],
      removed: options[0],
    })
  },
}

export const OpensOptionsWithoutSearchField: Story = {
  args: { ariaLabel: 'Tags da tarefa', value: [] },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )

    await expect(
      screen.queryByRole('combobox', { name: 'Tags da tarefa' }),
    ).toBeNull()
    await expect(
      await screen.findByRole('option', { name: 'Documentos' }),
    ).toBeInTheDocument()

    const positioner = canvasElement.ownerDocument.querySelector<HTMLElement>(
      '[data-slot="combobox-positioner"]',
    )
    const popup = positioner?.querySelector<HTMLElement>(':scope > span')
    await expect(popup?.className).toContain('w-max')
    await expect(popup?.className).toContain('min-w-0!')
    await expect(positioner?.dataset.align).toBe('end')
  },
}

export const ReadOnlyKeepsEditingControlsOut: Story = {
  args: { onValueChange: undefined, readOnly: true, variant: 'plain' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Documentos')).toBeInTheDocument()
    await expect(canvas.queryByRole('combobox')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeNull()
  },
}
