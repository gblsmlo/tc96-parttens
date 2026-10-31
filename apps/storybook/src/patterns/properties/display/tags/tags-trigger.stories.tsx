import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty, type TagsPropertyOption } from '@tc96/parttens'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

const options: TagsPropertyOption[] = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
]

const placementsCountLabel = (count: number) =>
  `${count} ${count === 1 ? 'posicionamento' : 'posicionamentos'}`

const meta = {
  args: { onValueChange: fn(), options, value: [] },
  component: TagsProperty,
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Trigger',
} satisfies Meta<typeof TagsProperty>

export default meta

type Story = StoryObj<typeof meta>

export const CountTriggerEmptyUntilChosen: Story = {
  args: { display: 'count', variant: 'badge' },
  render: (args) => (
    <div className="flex flex-col items-start gap-2">
      <TagsProperty {...args} value={[]} />
      <TagsProperty {...args} value={['documents']} />
      <TagsProperty {...args} value={['documents', 'return']} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = (name: string) =>
      within(canvasElement).getByRole('button', { name })

    await expect(trigger('Tags: 0 Tags').textContent).toBe('0 Tags')
    await expect(trigger('Tags: 0 Tags')).toHaveAttribute('data-empty', 'true')
    await expect(trigger('Tags: 1 Tag').textContent).toBe('1 Tag')
    await expect(trigger('Tags: 1 Tag')).not.toHaveAttribute('data-empty')
    await expect(trigger('Tags: 2 Tags').textContent).toBe('2 Tags')
  },
}

export const LabelledChipOpensEditing: Story = {
  args: { ariaLabel: 'Tags da tarefa' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Adicionar tag' })

    await expect(trigger).toHaveTextContent('Adicionar tag')
    await expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    await expect(
      trigger.querySelector('svg')?.classList.contains('lucide-tag'),
    ).toBe(true)
    await expect(
      canvasElement.querySelector('[data-slot="combobox-chips"]')
        ?.lastElementChild,
    ).toBe(trigger)

    await userEvent.click(trigger)
    await expect(
      canvas.getByRole('button', { name: 'Adicionar tag' }),
    ).toBeInTheDocument()
    await expect(
      screen.queryByRole('combobox', { name: 'Tags da tarefa' }),
    ).toBeNull()
  },
}

export const TriggerShrinksToPlusWithTags: Story = {
  args: { ariaLabel: 'Tags da tarefa', value: ['documents'] },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar tag',
    })

    await expect(trigger.textContent).toBe('')
    await expect(
      trigger.querySelector('svg')?.classList.contains('lucide-plus'),
    ).toBe(true)
    await expect(trigger.className).toContain('w-6')
  },
}

export const CountLabelNamesEditableTrigger: Story = {
  args: {
    ariaLabel: 'Posicionamentos',
    countLabel: placementsCountLabel,
    display: 'count',
    variant: 'badge',
  },
  render: (args) => (
    <div className="flex flex-col items-start gap-2">
      <TagsProperty {...args} value={[]} />
      <TagsProperty {...args} value={['documents']} />
      <TagsProperty {...args} value={['documents', 'return']} />
    </div>
  ),
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

    await expect(canvas.getByText('2 posicionamentos')).toBeInTheDocument()
    await expect(canvas.queryByText('2 Tags')).toBeNull()
  },
}
