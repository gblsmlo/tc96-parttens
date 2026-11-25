import { PlusIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { isIcon } from '../../../../test-utils/is-icon'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { EmailCanvas } from './email-canvas.tsx'
import { emailControlArgs } from './email-controls.ts'
import { ComposedEmail, ListInPopoverEmail } from './email-layouts.tsx'

const EMAIL = 'ana@example.com'
const OTHER = 'bruno@example.com'

const meta = {
  args: {
    action: fn(),
    value: [],
    ariaLabel: 'E-mails',
    placeholder: 'Sem e-mail',
    labels: ptBRPropertyLabels.email,
  },
  component: EmailProperty,
  decorators: [EmailCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Behavior',
} satisfies Meta<typeof EmailProperty>

export default meta

type Story = StoryObj<typeof meta>

const addTrigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Adicionar e-mail' })

const openAddPopover = async (canvasElement: HTMLElement) => {
  await userEvent.click(addTrigger(canvasElement))
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

const closePopover = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const popoverClosed = () =>
  waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

const UNFILLED = 'rgba(0, 0, 0, 0)'

const backgroundOf = (element: Element) =>
  getComputedStyle(element).backgroundColor

const removeButtons = (canvasElement: HTMLElement) =>
  within(canvasElement).getAllByRole('button', { name: /^Remover e-mail / })

export const EmptyTriggerNamesItself: Story = {
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)

    await expect(trigger.textContent).toContain('Sem e-mail')
    await expect(trigger).toHaveAttribute('data-empty', 'true')
  },
}

export const FilledTriggerCollapsesToPlus: Story = {
  args: { value: [EMAIL] },
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)

    await expect(trigger.textContent).toBe('')
    await expect(isIcon(trigger.querySelector('svg'), PlusIcon)).toBe(true)
    await expect(within(canvasElement).getByText(EMAIL)).toBeVisible()
  },
}

export const AddTriggerAnnouncesPopup: Story = {
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)

    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const popup = await screen.findByRole('dialog', {
      name: 'Adicionar e-mail',
    })
    await waitFor(() => expect(popup).toBeVisible())

    await closePopover()
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

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([EMAIL, OTHER], {
      added: OTHER,
      previousValue: [EMAIL],
      removed: null,
    })
    await popoverClosed()
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

    await closePopover()
  },
}

export const NoAnotherWhenDeclaredEntriesFilled: Story = {
  args: { value: [EMAIL, OTHER] },
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)

    await expect(
      await screen.findByRole('button', { name: 'Adicionar outro' }),
    ).toBeDisabled()

    await closePopover()
  },
}

export const EnterSaves: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', OTHER)
    await userEvent.keyboard('{Enter}')

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([OTHER], {
      added: OTHER,
      previousValue: [],
      removed: null,
    })
    await popoverClosed()
  },
}

export const OnValueChangeWithoutAction: Story = {
  args: { action: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', OTHER)
    await userEvent.keyboard('{Enter}')

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith([OTHER])
    await popoverClosed()
  },
}

export const InvalidFormatRejectedInField: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    const field = await fillEntry('Principal', 'ana@')
    await save()

    await expect(args.action).not.toHaveBeenCalled()
    await expect((await screen.findByRole('alert')).textContent).toBe(
      'Informe um e-mail válido.',
    )
    await expect(field).toHaveAttribute('aria-invalid', 'true')

    await closePopover()
  },
}

export const DuplicateAddressRejected: Story = {
  args: { value: [EMAIL] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await addAnother()
    await fillEntry('Secundário', EMAIL)
    await save()

    await expect(args.action).not.toHaveBeenCalled()
    await expect((await screen.findByRole('alert')).textContent).toBe(
      'Este e-mail já está na lista.',
    )

    await closePopover()
  },
}

export const ConsumerErrorShowsInPopup: Story = {
  args: { errorMessage: 'Este e-mail já pertence a outro contato.' },
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)

    await expect((await screen.findByRole('alert')).textContent).toBe(
      'Este e-mail já pertence a outro contato.',
    )

    await closePopover()
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

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([OTHER], {
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

    await expect(field).toHaveAttribute('data-slot', 'editable-text')
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()
    await expect(screen.queryByRole('dialog')).toBeNull()

    await userEvent.click(field)
    await userEvent.type(field, OTHER)
    await userEvent.tab()

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith([OTHER], {
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

    await expect(args.action).not.toHaveBeenCalled()
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
    const trigger = canvas.getByRole('button', {
      name: `E-mails: ${EMAIL} +1`,
    })

    await expect(trigger.textContent).toContain('+1')
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()

    await userEvent.click(trigger)
    await expect(
      await screen.findByRole('textbox', { name: 'Principal' }),
    ).toHaveValue(EMAIL)

    await closePopover()
  },
}

export const ReadOnlyWithoutEditPath: Story = {
  args: { action: undefined, readOnly: true, value: [EMAIL] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.getByText(EMAIL)).toBeVisible()
  },
}

export const ReadOnlyWinsOverHandler: Story = {
  render: () => <ComposedEmail {...emailControlArgs} readOnly />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button')).toBeNull()
    for (const address of emailControlArgs.value) {
      await expect(canvas.getByText(address)).toBeVisible()
    }
  },
}

export const ReadOnlyEmptySaysAbsence: Story = {
  render: () => <ComposedEmail {...emailControlArgs} readOnly value={[]} />,
  play: async ({ canvasElement }) => {
    const absence = within(canvasElement).getByText('Sem e-mail')

    await expect(absence).toHaveAttribute('data-empty', 'true')
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const AddTriggerOffKeepsRemove: Story = {
  render: () => <ComposedEmail {...emailControlArgs} addTrigger={false} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()
    await expect(removeButtons(canvasElement)).toHaveLength(2)
    for (const remove of removeButtons(canvasElement)) {
      await expect(remove).toBeEnabled()
    }
  },
}

export const DisabledBlocksAddAndRemoveAndDimsTheTrigger: Story = {
  render: () => <ComposedEmail {...emailControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const trigger = addTrigger(canvasElement)

    await expect(trigger).toBeDisabled()
    await expect(getComputedStyle(trigger).opacity).toBe('0.64')
    for (const remove of removeButtons(canvasElement)) {
      await expect(remove).toBeDisabled()
    }
  },
}

export const BadgeVariantFillsReadOnlyAddresses: Story = {
  render: () => (
    <ComposedEmail {...emailControlArgs} readOnly variant="badge" />
  ),
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole('group', { name: 'E-mails' })
    const surfaces = row.querySelectorAll('[data-slot="property-surface"]')

    await expect(row).toHaveAttribute('data-variant', 'badge')
    await expect(surfaces).toHaveLength(2)
    for (const surface of surfaces) {
      await expect(surface).toHaveAttribute('data-variant', 'badge')
      await expect(backgroundOf(surface)).not.toBe(UNFILLED)
    }
  },
}

export const BadgeVariantFillsTheListTrigger: Story = {
  render: () => <ListInPopoverEmail {...emailControlArgs} variant="badge" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'E-mails: ana.souza@example.com +1',
    })

    await expect(trigger).toHaveAttribute('data-variant', 'badge')
    await expect(backgroundOf(trigger)).not.toBe(UNFILLED)
  },
}

export const PlainListTriggerHasNoFillAtRest: Story = {
  render: () => <ListInPopoverEmail {...emailControlArgs} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'E-mails: ana.souza@example.com +1',
    })

    await expect(trigger).toHaveAttribute('data-variant', 'plain')
    await expect(backgroundOf(trigger)).toBe(UNFILLED)
  },
}

export const EmptyListTriggerNamesOnlyTheProperty: Story = {
  render: () => <ListInPopoverEmail {...emailControlArgs} value={[]} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'E-mails',
    })

    await expect(trigger).toHaveTextContent('Sem e-mail')
    await expect(trigger).toHaveAttribute('data-empty', 'true')
  },
}
