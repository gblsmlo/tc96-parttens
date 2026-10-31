import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const EMAIL = 'ana@example.com'
const OTHER = 'bruno@example.com'

const meta = {
  args: { action: fn(), value: [] },
  component: EmailProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-72 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Behavior',
} satisfies Meta<typeof EmailProperty>

export default meta

type Story = StoryObj<typeof meta>

const openAddPopover = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Adicionar e-mail' }),
  )
}

const fillEntry = async (label: string, email: string) => {
  const field = await screen.findByRole('textbox', { name: label })
  await userEvent.clear(field)
  await userEvent.type(field, email)
  return field
}

const addAnother = () =>
  userEvent.click(screen.getByRole('button', { name: 'Adicionar outro' }))

const save = () =>
  userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

export const EmptyTriggerNamesItself: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toContain('Sem e-mail')
    await expect(trigger.getAttribute('data-empty')).toBe('true')
  },
}

export const FilledTriggerCollapsesToPlus: Story = {
  args: { value: [EMAIL] },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toBe('')
    await expect(trigger.querySelector('svg')).not.toBeNull()
  },
}

export const PopupAppendsSecondAddress: Story = {
  args: { value: [EMAIL] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toHaveValue(EMAIL)

    await addAnother()
    await fillEntry('Secundário', OTHER)
    await save()

    await expect(args.action).toHaveBeenCalledWith([EMAIL, OTHER], {
      added: OTHER,
      previousValue: [EMAIL],
      removed: null,
    })
  },
}

export const AddAnotherNeedsValidFirst: Story = {
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)
    await expect(
      await screen.findByRole('button', { name: 'Adicionar outro' }),
    ).toBeDisabled()

    await fillEntry('Principal', 'ana@')
    await expect(
      screen.getByRole('button', { name: 'Adicionar outro' }),
    ).toBeDisabled()

    await fillEntry('Principal', EMAIL)
    await expect(
      screen.getByRole('button', { name: 'Adicionar outro' }),
    ).toBeEnabled()
  },
}

export const NoAnotherWhenDeclaredEntriesFilled: Story = {
  args: { value: [EMAIL, OTHER] },
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)

    await expect(
      await screen.findByRole('button', { name: 'Adicionar outro' }),
    ).toBeDisabled()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EnterSaves: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', OTHER)
    await userEvent.keyboard('{Enter}')

    await expect(args.action).toHaveBeenCalledWith([OTHER], {
      added: OTHER,
      previousValue: [],
      removed: null,
    })
  },
}

export const InvalidFormatRejectedInField: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', 'ana@')
    await save()

    await expect(args.action).toHaveBeenCalledTimes(0)
    await expect((await screen.findByRole('alert')).textContent).toBe(
      'Informe um e-mail válido.',
    )
  },
}

export const DuplicateAddressRejected: Story = {
  args: { value: [EMAIL] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await addAnother()
    await fillEntry('Secundário', EMAIL)
    await save()

    await expect(args.action).toHaveBeenCalledTimes(0)
    await expect((await screen.findByRole('alert')).textContent).toBe(
      'Este e-mail já está na lista.',
    )
  },
}

export const RemoveNamesTheRemovedAddress: Story = {
  args: { value: [EMAIL, OTHER] },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Remover e-mail ${EMAIL}`,
      }),
    )

    await expect(args.action).toHaveBeenCalledWith([OTHER], {
      added: null,
      previousValue: [EMAIL, OTHER],
      removed: EMAIL,
    })
  },
}

export const InlineSwapsTriggerForField: Story = {
  args: { editing: 'inline' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await openAddPopover(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Adicionar e-mail' })

    await expect(field.getAttribute('data-slot')).toBe('editable-text')
    await expect(screen.queryByRole('dialog')).toBeNull()

    await userEvent.click(field)
    await userEvent.type(field, OTHER)
    await userEvent.tab()

    await expect(args.action).toHaveBeenCalledWith([OTHER], {
      added: OTHER,
      previousValue: [],
      removed: null,
    })
  },
}

export const InlineRejectedFormatKeepsField: Story = {
  args: { editing: 'inline' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await openAddPopover(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Adicionar e-mail' })
    await userEvent.click(field)
    await userEvent.type(field, 'ana@')
    await userEvent.tab()

    await expect(args.action).toHaveBeenCalledTimes(0)
    await expect((await canvas.findByRole('alert')).textContent).toBe(
      'Informe um e-mail válido.',
    )
    await expect(
      canvas.getByRole('textbox', { name: 'Adicionar e-mail' }),
    ).toHaveValue('ana@')
  },
}

export const TriggerDisplayKeepsNamingTheProperty: Story = {
  args: { display: 'trigger', value: [EMAIL, OTHER] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /E-mails: / })

    await expect(trigger.textContent).toContain('+1')
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()

    await userEvent.click(trigger)
    await expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const AddTriggerAnnouncesPopup: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    await expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(trigger)

    await expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const ReadOnlyWithoutEditPath: Story = {
  args: { action: undefined, readOnly: true, value: [EMAIL] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()
    await expect(canvas.getByText(EMAIL)).toBeInTheDocument()
  },
}
