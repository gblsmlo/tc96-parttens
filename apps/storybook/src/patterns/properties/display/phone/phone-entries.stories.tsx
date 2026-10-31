import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const PHONE = '+5511987654321'
const OTHER = '+5511912345678'

const meta = {
  args: { action: fn(), value: [] },
  component: PhoneProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Entries',
} satisfies Meta<typeof PhoneProperty>

export default meta

type Story = StoryObj<typeof meta>

async function openAddPopover(canvasElement: HTMLElement) {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Adicionar telefone' }),
  )
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

export const PopupStartsWithValueAndAddsSecond: Story = {
  args: { value: [PHONE] },
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await expect(
      (
        (await screen.findByRole('textbox', {
          name: 'Principal',
        })) as HTMLInputElement
      ).value,
    ).toContain('98765-4321')

    await userEvent.click(addAnother())
    await fillEntry('Secundário', OTHER)
    await save()

    await expect(args.action).toHaveBeenCalledWith([PHONE, OTHER], {
      added: OTHER,
      previousValue: [PHONE],
      removed: null,
    })
  },
}

export const AddAnotherNeedsValidFirst: Story = {
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)
    await screen.findByRole('textbox', { name: 'Principal' })
    await expect(addAnother()).toBeDisabled()

    await fillEntry('Principal', '+55119876')
    await expect(addAnother()).toBeDisabled()

    await fillEntry('Principal', PHONE)
    await expect(addAnother()).toBeEnabled()
  },
}

export const DeclaredEntriesFull: Story = {
  args: { value: [PHONE, OTHER] },
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)
    await screen.findByRole('textbox', { name: 'Principal' })

    await expect(addAnother()).toBeDisabled()
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

    await expect(args.action).toHaveBeenCalledTimes(0)
    await expect(await screen.findByRole('alert')).toHaveTextContent(
      /^Este telefone já está na lista\.$/,
    )
  },
}

export const ConsumerRejectionInForm: Story = {
  args: { errorMessage: 'Já existe outro contato com este telefone.' },
  play: async ({ canvasElement }) => {
    await openAddPopover(canvasElement)

    await expect(await screen.findByRole('alert')).toHaveTextContent(
      /^Já existe outro contato com este telefone\.$/,
    )
    await waitFor(() =>
      expect(
        document.querySelector('[data-slot="popover-popup"]'),
      ).not.toHaveAttribute('data-starting-style'),
    )
  },
}

export const IncompleteNumberRejectedInField: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    const field = await fillEntry('Principal', '+55119876')
    await save()

    await expect(args.action).toHaveBeenCalledTimes(0)
    await expect(await screen.findByRole('alert')).toHaveTextContent(
      /^Informe um telefone válido\.$/,
    )
    await expect(field).toHaveAttribute('aria-invalid', 'true')
  },
}

export const NationalFormatEmitsE164: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', '(11) 98765-4321')
    await save()

    await expect(args.action).toHaveBeenCalledWith(['+5511987654321'], {
      added: '+5511987654321',
      previousValue: [],
      removed: null,
    })
  },
}

export const EnterSaves: Story = {
  play: async ({ args, canvasElement }) => {
    await openAddPopover(canvasElement)
    await fillEntry('Principal', PHONE)
    await userEvent.keyboard('{Enter}')

    await expect(args.action).toHaveBeenCalledWith([PHONE], {
      added: PHONE,
      previousValue: [],
      removed: null,
    })
  },
}
