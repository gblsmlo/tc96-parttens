import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const ANA = 'ana@example.com'
const BIA = 'bia@example.com'

const openForm = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Adicionar e-mail' }),
  )
  return within(await screen.findByRole('dialog', { name: 'Adicionar e-mail' }))
}

const closeForm = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const meta = {
  args: { onValueChange: fn(), value: [ANA] },
  component: EmailProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Shared/Entry Form',
} satisfies Meta<typeof EmailProperty>

export default meta

type Story = StoryObj<typeof meta>

export const LabelsEachEntry: Story = {
  play: async ({ canvasElement }) => {
    const form = await openForm(canvasElement)

    await expect(form.getByText('Principal')).toBeInTheDocument()
    await expect(
      form.getByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()
    await closeForm()
  },
}

export const SingleLabelHidesEntryLabel: Story = {
  args: { entryLabels: ['Principal'] },
  play: async ({ canvasElement }) => {
    const form = await openForm(canvasElement)

    await expect(
      form.getByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()
    await expect(form.queryByText('Principal')).toBeNull()
    await closeForm()
  },
}

export const FallsBackPastTheLabels: Story = {
  args: { value: ['a@example.com', 'b@example.com', 'c@example.com'] },
  play: async ({ canvasElement }) => {
    const form = await openForm(canvasElement)
    const fields = form.getAllByRole('textbox')

    await expect(form.getByText('3')).toBeInTheDocument()
    await expect(fields).toHaveLength(3)
    await expect(fields[2]?.getAttribute('aria-label')).toBe('Adicionar e-mail')
    await closeForm()
  },
}

export const NoRemoveWithSingleDraft: Story = {
  play: async ({ canvasElement }) => {
    const form = await openForm(canvasElement)

    await expect(form.queryByRole('button', { name: /Remover/ })).toBeNull()
    await closeForm()
  },
}

export const RemovesTheDraftAtItsIndex: Story = {
  args: { value: [ANA, BIA] },
  play: async ({ args, canvasElement }) => {
    const form = await openForm(canvasElement)

    await userEvent.click(
      form.getByRole('button', { name: 'Remover Secundário e-mail' }),
    )

    await expect(form.getAllByRole('textbox')).toHaveLength(1)
    await expect(form.getByRole('textbox', { name: 'Principal' })).toHaveValue(
      ANA,
    )

    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))
    await expect(args.onValueChange).toHaveBeenCalledWith([ANA])
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const ForwardsTypingWithTheFieldIndex: Story = {
  args: { value: [ANA, BIA] },
  play: async ({ args, canvasElement }) => {
    const form = await openForm(canvasElement)
    const second = form.getByRole('textbox', { name: 'Secundário' })

    await userEvent.clear(second)
    await userEvent.type(second, 'novo@example.com')

    await expect(second).toHaveValue('novo@example.com')
    await expect(form.getByRole('textbox', { name: 'Principal' })).toHaveValue(
      ANA,
    )

    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))
    await expect(args.onValueChange).toHaveBeenCalledWith([
      ANA,
      'novo@example.com',
    ])
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const SavesOnEnterWithoutReachingThePopup: Story = {
  play: async ({ args, canvasElement }) => {
    const form = await openForm(canvasElement)
    const field = form.getByRole('textbox', { name: 'Principal' })
    const outer = fn()
    document.addEventListener('keydown', outer)

    await userEvent.type(field, '{Enter}')
    document.removeEventListener('keydown', outer)

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(outer).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const IgnoresOtherKeys: Story = {
  play: async ({ args, canvasElement }) => {
    const form = await openForm(canvasElement)

    await userEvent.type(form.getByRole('textbox', { name: 'Principal' }), 'a')

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await closeForm()
  },
}

export const SavesThroughSubmitWithoutNativeValidation: Story = {
  play: async ({ args, canvasElement }) => {
    const form = await openForm(canvasElement)

    await expect(
      form.getByRole('button', { name: 'Salvar' }).closest('form')?.noValidate,
    ).toBe(true)

    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const AddAnotherDisabledWhenNotAllowed: Story = {
  args: { value: [ANA, BIA] },
  play: async ({ canvasElement }) => {
    const form = await openForm(canvasElement)

    await expect(
      form.getByRole('button', { name: 'Adicionar outro' }),
    ).toBeDisabled()
    await closeForm()
  },
}

export const AddAnotherAddsAnEntry: Story = {
  play: async ({ canvasElement }) => {
    const form = await openForm(canvasElement)

    await userEvent.click(form.getByRole('button', { name: 'Adicionar outro' }))

    await expect(form.getAllByRole('textbox')).toHaveLength(2)
    await expect(form.getByRole('textbox', { name: 'Secundário' })).toHaveValue(
      '',
    )
    await closeForm()
  },
}

export const AnnouncesFieldErrorsAndConsumerRefusal: Story = {
  args: { errorMessage: 'Já existe no workspace.', value: [] },
  play: async ({ args, canvasElement }) => {
    const form = await openForm(canvasElement)
    const field = form.getByRole('textbox', { name: 'Principal' })

    await userEvent.type(field, 'ana')
    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))

    const alerts = await form.findAllByRole('alert')
    await expect(alerts.map((alert) => alert.textContent)).toEqual([
      'Informe um e-mail válido.',
      'Já existe no workspace.',
    ])
    await expect(field.getAttribute('aria-invalid')).toBe('true')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await closeForm()
  },
}
