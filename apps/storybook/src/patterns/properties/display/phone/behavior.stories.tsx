import { PlusIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneProperty } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { isIcon } from '../../../../test-utils/is-icon'
import { PhoneCanvas } from './phone-canvas.tsx'

const PHONE = '+5511987654321'
const OTHER = '+5511912345678'
const PHONE_LABEL = '+55 11 98765 4321'

const meta = {
  args: { action: fn(), value: [] },
  component: PhoneProperty,
  decorators: [PhoneCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Behavior',
} satisfies Meta<typeof PhoneProperty>

export default meta

type Story = StoryObj<typeof meta>

const addTrigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Adicionar telefone' })

const popoverClosed = () =>
  waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

const closePopover = async () => {
  await userEvent.keyboard('{Escape}')
  await popoverClosed()
}

async function openAddPopover(canvasElement: HTMLElement) {
  await userEvent.click(addTrigger(canvasElement))
  await waitFor(() => {
    const popup = document.querySelector('[data-slot="popover-popup"]')
    if (!popup || popup.hasAttribute('data-starting-style'))
      throw new Error('The phone popover did not open.')
  })
}

async function fillEntry(label: string, phone: string) {
  const field = await screen.findByRole('textbox', { name: label })
  await userEvent.clear(field)
  await userEvent.type(field, phone)
  return field
}

const addAnother = () => screen.getByRole('button', { name: 'Adicionar outro' })

const save = () =>
  userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

export const EmptyTriggerNamesItself: Story = {
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)

    await expect(trigger).toHaveTextContent('Sem telefone')
    await expect(trigger).toHaveAttribute('data-empty', 'true')
  },
}

export const FilledTriggerCollapsesToPlus: Story = {
  args: { value: [PHONE] },
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)
    const { height, width } = trigger.getBoundingClientRect()

    await expect(trigger.textContent).toBe('')
    await expect(isIcon(trigger.querySelector('svg'), PlusIcon)).toBe(true)
    await expect(width).toBe(24)
    await expect(height).toBe(24)
    await expect(within(canvasElement).getByText(PHONE_LABEL)).toBeVisible()
  },
}

export const AddTriggerAnnouncesPopup: Story = {
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)

    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(
      await screen.findByRole('dialog', { name: 'Adicionar telefone' }),
    ).toBeInTheDocument()
    await closePopover()
  },
}

export const RemoveNamesTheRemovedNumber: Story = {
  args: { value: [PHONE, OTHER] },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Remover telefone ${PHONE_LABEL}`,
      }),
    )

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([OTHER], {
      added: null,
      previousValue: [PHONE, OTHER],
      removed: PHONE,
    })
  },
}

export const AddDisabledKeepsRemove: Story = {
  args: { addDisabled: true, value: [PHONE] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()
    await expect(
      canvas.getByRole('button', { name: `Remover telefone ${PHONE_LABEL}` }),
    ).toBeEnabled()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const DisabledBlocksAddAndRemove: Story = {
  args: { disabled: true, value: [PHONE] },
  play: async ({ args, canvasElement }) => {
    const remove = within(canvasElement).getByRole('button', {
      name: `Remover telefone ${PHONE_LABEL}`,
    })

    await expect(addTrigger(canvasElement)).toBeDisabled()
    await expect(remove).toBeDisabled()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const PersistentTriggerNamesFilledProperty: Story = {
  args: { display: 'trigger', value: [PHONE, OTHER] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', {
      name: `Telefones: ${PHONE_LABEL} +1`,
    })

    await expect(trigger.textContent).toBe(`${PHONE_LABEL} +1`)
    await expect(canvas.getAllByRole('button')).toEqual([trigger])

    await userEvent.click(trigger)
    await expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()
    await expect(
      screen.getByRole('textbox', { name: 'Secundário' }),
    ).toBeInTheDocument()
    await closePopover()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const ReadOnlyWithoutAction: Story = {
  args: { action: undefined, value: [PHONE] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.getByText(PHONE_LABEL)).toBeVisible()
    await expect(canvas.queryByText(PHONE)).toBeNull()
  },
}

export const ReadOnlyWinsOverHandler: Story = {
  args: { readOnly: true, value: [PHONE] },
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const ReadOnlyEmptySaysAbsence: Story = {
  args: { action: undefined },
  play: async ({ canvasElement }) => {
    const absence = within(canvasElement).getByText('Sem telefone')

    await expect(absence).toBeVisible()
    await expect(absence).toHaveAttribute('data-empty', 'true')
  },
}

export const UnparseableValueShowsAsIs: Story = {
  args: { action: undefined, value: ['ramal 204'] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('ramal 204')).toBeVisible()
  },
}

export const PopupStartsWithValueAndAddsSecond: Story = {
  args: { value: [PHONE] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toHaveValue('(11) 98765-4321')

    await userEvent.click(addAnother())
    await fillEntry('Secundário', OTHER)
    await save()

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([PHONE, OTHER], {
      added: OTHER,
      previousValue: [PHONE],
      removed: null,
    })
    await popoverClosed()
  },
}

export const AddAnotherNeedsValidFirst: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await screen.findByRole('textbox', { name: 'Principal' })
    await expect(addAnother()).toBeDisabled()

    await fillEntry('Principal', '+55119876')
    await expect(addAnother()).toBeDisabled()

    await fillEntry('Principal', PHONE)
    await expect(addAnother()).toBeEnabled()

    await closePopover()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const DeclaredEntriesFull: Story = {
  args: { value: [PHONE, OTHER] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await screen.findByRole('textbox', { name: 'Secundário' })

    await expect(addAnother()).toBeDisabled()
    await closePopover()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const DuplicateNumberRejected: Story = {
  args: { value: [PHONE] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await screen.findByRole('textbox', { name: 'Principal' })
    await userEvent.click(addAnother())
    await fillEntry('Secundário', PHONE)
    await save()

    await expect(args.action).not.toHaveBeenCalled()
    await expect(await screen.findByRole('alert')).toHaveTextContent(
      /^Este telefone já está na lista\.$/,
    )
    await closePopover()
  },
}

export const IncompleteNumberRejectedInField: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    const field = await fillEntry('Principal', '+55119876')
    await userEvent.keyboard('{Enter}')

    await expect(args.action).not.toHaveBeenCalled()
    await expect(await screen.findByRole('alert')).toHaveTextContent(
      /^Informe um telefone válido\.$/,
    )
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await closePopover()
  },
}

export const ConsumerRejectionInForm: Story = {
  args: { errorMessage: 'Já existe outro contato com este telefone.' },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)

    await expect(await screen.findByRole('alert')).toHaveTextContent(
      /^Já existe outro contato com este telefone\.$/,
    )
    await closePopover()
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const NationalFormatEmitsE164: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', '(11) 98765-4321')
    await save()

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([PHONE], {
      added: PHONE,
      previousValue: [],
      removed: null,
    })
    await popoverClosed()
  },
}

export const DefaultCountryReachesFields: Story = {
  args: { defaultCountry: 'PT' },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', '912 345 678')

    await expect(
      screen.getByRole('combobox', { name: 'País: Portugal' }),
    ).toBeVisible()
    await save()
    await expect(args.action).toHaveBeenLastCalledWith(['+351912345678'], {
      added: '+351912345678',
      previousValue: [],
      removed: null,
    })
    await popoverClosed()
  },
}

export const EnterSaves: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', PHONE)
    await userEvent.keyboard('{Enter}')

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([PHONE], {
      added: PHONE,
      previousValue: [],
      removed: null,
    })
    await popoverClosed()
  },
}
