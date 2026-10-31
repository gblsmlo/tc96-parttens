import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty, type SelectPropertyOption } from '@tc96/parttens'
import { CircleIcon } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const options: SelectPropertyOption[] = [
  { label: 'Reunião', value: 'meeting' },
  { label: 'Ligação', value: 'call' },
  { label: 'Outro', value: 'other' },
]

const meta = {
  args: { ariaLabel: 'Tipo', options },
  component: SelectProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Value',
} satisfies Meta<typeof SelectProperty>

export default meta

type Story = StoryObj<typeof SelectProperty>

const surface = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="property-surface"]')

export const OptionIconIsPropertyIcon: Story = {
  args: {
    ariaLabel: 'Prioridade',
    options: [{ icon: CircleIcon, label: 'Reunião', value: 'meeting' }],
    readOnly: true,
    value: 'meeting',
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('svg')?.getAttribute('data-slot'),
    ).toBe('property-icon')
  },
}

export const StaysValueWithoutHandler: Story = {
  args: { value: 'meeting' },
  play: async ({ canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute('role', 'img')
    await expect(surface(canvasElement)).toHaveAttribute(
      'aria-label',
      'Tipo: Reunião',
    )
    await expect(within(canvasElement).queryByRole('combobox')).toBeNull()
  },
}

export const TriggerOnceConsumerCanPersist: Story = {
  args: { action: fn(), value: 'call' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Tipo: Ligação' }),
    ).toBeInTheDocument()
  },
}

export const ReportsChoiceWithReplacedValue: Story = {
  args: { action: fn(), value: 'call' },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Ligação',
    })
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Outro' }))
    await waitFor(() =>
      expect(
        document.querySelector('[data-base-ui-focus-guard]'),
      ).not.toBeInTheDocument(),
    )

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(
      'other',
      expect.objectContaining({ previousValue: 'call' }),
    )
  },
}

export const NamesPropertyWhileEmpty: Story = {
  args: { placeholder: 'Tipo', value: null },
  play: async ({ canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute('aria-label', 'Tipo')
    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')
    await expect(canvasElement).toHaveTextContent('Tipo')
  },
}

export const FallbackOutsideCatalog: Story = {
  args: { fallback: 'Não informado', value: 'desconhecido' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('Não informado')
    await expect(surface(canvasElement)).toHaveAttribute(
      'aria-label',
      'Tipo: Não informado',
    )
  },
}
