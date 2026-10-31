import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

const PHONE = '+5511987654321'
const OTHER = '+5511912345678'
const PHONE_LABEL = '+55 11 98765 4321'

const meta = {
  args: { value: [] },
  component: PhoneProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Trigger',
} satisfies Meta<typeof PhoneProperty>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyRowReadsAsAbsent: Story = {
  args: { action: fn() },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar telefone',
    })

    await expect(trigger).toHaveTextContent('Sem telefone')
    await expect(trigger).toHaveAttribute('data-empty', 'true')
  },
}

export const AddTriggerAnnouncesPopup: Story = {
  args: { action: fn() },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar telefone',
    })

    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const TriggerCollapsesToPlus: Story = {
  args: { action: fn(), value: [PHONE] },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar telefone',
    })

    await expect(trigger.textContent).toBe('')
    await expect(trigger.querySelector('svg')).toBeInTheDocument()
  },
}

export const PersistentTriggerNamesFilledProperty: Story = {
  args: { action: fn(), display: 'trigger', value: [PHONE, OTHER] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', {
      name: `Telefones: ${PHONE_LABEL} +1`,
    })

    await expect(trigger.textContent).toBe(`${PHONE_LABEL} +1`)
    await expect(canvas.getByRole('button', { name: /Telefones: / })).toBe(
      trigger,
    )
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()

    await userEvent.click(trigger)
    await expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()
  },
}

export const ReadOnlyWithoutAction: Story = {
  args: { value: [PHONE] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.getByText(PHONE_LABEL)).toBeInTheDocument()
    await expect(canvas.queryByText(PHONE)).toBeNull()
  },
}

export const ReadOnlyEmptySaysAbsence: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Sem telefone'),
    ).toBeInTheDocument()
  },
}

export const UnparseableValueShowsAsIs: Story = {
  args: { value: ['ramal 204'] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('ramal 204'),
    ).toBeInTheDocument()
  },
}

export const AddDisabledKeepsRemove: Story = {
  args: { action: fn(), addDisabled: true, value: [PHONE] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()
    await expect(
      canvas.getByRole('button', { name: `Remover telefone ${PHONE_LABEL}` }),
    ).toBeInTheDocument()
  },
}

export const RemoveNamesTheRemovedNumber: Story = {
  args: { action: fn(), value: [PHONE, OTHER] },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Remover telefone ${PHONE_LABEL}`,
      }),
    )

    await expect(args.action).toHaveBeenCalledWith([OTHER], {
      added: null,
      previousValue: [PHONE, OTHER],
      removed: PHONE,
    })
  },
}
