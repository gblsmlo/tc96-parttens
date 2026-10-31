import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty, type SelectPropertyOption } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const options: SelectPropertyOption[] = [
  { label: 'Reunião', value: 'meeting' },
  { label: 'Ligação', value: 'call' },
  { label: 'Outro', value: 'other' },
]

const meta = {
  args: {
    ariaLabel: 'Prioridade',
    emptyOptionLabel: 'Sem prioridade',
    options,
    placeholder: 'Prioridade',
  },
  component: SelectProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  render: function Controlled(args) {
    const [value, setValue] = useState(args.value)

    return <SelectProperty {...args} onValueChange={setValue} value={value} />
  },
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Empty Option',
} satisfies Meta<typeof SelectProperty>

export default meta

type Story = StoryObj<typeof SelectProperty>

const surface = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="property-surface"]')

const closed = (trigger: HTMLElement) =>
  waitFor(() => {
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(
      document.querySelector('[data-base-ui-focus-guard]'),
    ).not.toBeInTheDocument()
  })

async function choose(trigger: HTMLElement, name: string) {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name }))
  await closed(trigger)
}

export const ReportsEmptyOptionAsNull: Story = {
  args: {
    action: fn(),
    ariaLabel: 'Tipo',
    emptyOptionLabel: 'Sem tipo',
    placeholder: 'Tipo',
    value: 'call',
  },
  render: (args) => <SelectProperty {...args} />,
  play: async ({ args, canvasElement }) => {
    await choose(
      within(canvasElement).getByRole('combobox', { name: 'Tipo: Ligação' }),
      'Sem tipo',
    )

    await expect(
      (args.action as ReturnType<typeof fn>).mock.calls.map(([value]) => value),
    ).toEqual([null])
  },
}

export const EmptyOptionWithoutIconWhenCatalogHasNone: Story = {
  args: {
    ariaLabel: 'Frequência',
    emptyOptionLabel: 'Não repete',
    options: [{ label: 'Diariamente', value: 'daily' }],
    value: 'daily',
  },
  render: function WithAction(args) {
    const [value, setValue] = useState(args.value)

    return (
      <SelectProperty
        {...args}
        action={(next) => setValue(next)}
        value={value}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole('combobox', {
      name: 'Frequência: Diariamente',
    })
    await userEvent.click(trigger)
    const empty = await screen.findByRole('option', { name: 'Não repete' })
    await expect(empty.lastElementChild?.querySelector('svg')).toBeNull()
    await userEvent.click(empty)
    await closed(trigger)

    await expect(trigger).toHaveAccessibleName('Frequência: Não repete')
    await expect(trigger.querySelector('svg')).toBeNull()
  },
}

export const FilledAfterPickingEmptyOverNull: Story = {
  args: { value: null },
  play: async ({ canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')

    await choose(
      within(canvasElement).getByRole('combobox', { name: 'Prioridade' }),
      'Sem prioridade',
    )

    await waitFor(() =>
      expect(surface(canvasElement)).not.toHaveAttribute('data-empty'),
    )
    await expect(surface(canvasElement)).toHaveAttribute(
      'aria-label',
      'Prioridade: Sem prioridade',
    )
    await expect(canvasElement).toHaveTextContent('Sem prioridade')
    await expect(surface(canvasElement)?.querySelector('svg')).toBeNull()
  },
}

export const FilledAfterMovingFromValueToEmpty: Story = {
  args: { value: 'call' },
  play: async ({ canvasElement }) => {
    await choose(
      within(canvasElement).getByRole('combobox', {
        name: 'Prioridade: Ligação',
      }),
      'Sem prioridade',
    )

    await waitFor(() =>
      expect(surface(canvasElement)).toHaveAttribute(
        'aria-label',
        'Prioridade: Sem prioridade',
      ),
    )
    await expect(surface(canvasElement)).not.toHaveAttribute('data-empty')
  },
}

export const AbsentAgainWhenNullReturnsFromOutside: Story = {
  args: { onValueChange: fn(), value: null },
  render: function ExternalValue(args) {
    const [value, setValue] = useState(args.value)

    return (
      <div className="flex items-center gap-2">
        <SelectProperty {...args} value={value} />
        <Button onClick={() => setValue('call')} variant="outline">
          Receber Ligação
        </Button>
        <Button onClick={() => setValue(null)} variant="outline">
          Receber vazio
        </Button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await choose(
      canvas.getByRole('combobox', { name: 'Prioridade' }),
      'Sem prioridade',
    )
    await waitFor(() =>
      expect(surface(canvasElement)).not.toHaveAttribute('data-empty'),
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Receber Ligação' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Receber vazio' }))

    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')
  },
}
