import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/parttens'
import { useEffect, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const ANA = 'ana@example.com'
const BIA = 'bia@example.com'
const CAIO = 'caio@example.com'
const INVALID = 'Informe um e-mail válido.'

const externalValue: { set?: (next: readonly string[]) => void } = {}

function ExternalValue() {
  const [value, setValue] = useState<readonly string[]>([ANA])

  useEffect(() => {
    externalValue.set = setValue
    return () => {
      externalValue.set = undefined
    }
  }, [])

  return <EmailProperty onValueChange={setValue} value={value} />
}

const openEditor = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Adicionar e-mail' }),
  )
  return within(await screen.findByRole('dialog', { name: 'Adicionar e-mail' }))
}

const closeEditor = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const draftsOf = () =>
  within(screen.getByRole('dialog'))
    .getAllByRole<HTMLInputElement>('textbox')
    .map((field) => field.value)

const replaceText = async (field: HTMLElement, text: string) => {
  await userEvent.clear(field)
  if (text) await userEvent.type(field, text)
}

const meta = {
  args: { action: fn(), value: [ANA] },
  component: EmailProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Hooks/Entry List Editor',
} satisfies Meta<typeof EmailProperty>

export default meta

type Story = StoryObj<typeof meta>

export const OpensWithTheValueAsDrafts: Story = {
  args: { value: [ANA, BIA] },
  play: async ({ canvasElement }) => {
    await openEditor(canvasElement)

    await expect(draftsOf()).toEqual([ANA, BIA])
    await closeEditor()
  },
}

export const OpensWithOneBlankDraftWhenEmpty: Story = {
  args: { value: [] },
  play: async ({ canvasElement }) => {
    const editor = await openEditor(canvasElement)

    await expect(draftsOf()).toEqual([''])
    await expect(editor.queryByRole('alert')).toBeNull()
    await closeEditor()
  },
}

export const ReopeningDiscardsTyping: Story = {
  play: async ({ canvasElement }) => {
    const editor = await openEditor(canvasElement)
    await replaceText(
      editor.getByRole('textbox', { name: 'Principal' }),
      'xyz@example.com',
    )
    await closeEditor()

    await openEditor(canvasElement)

    await expect(draftsOf()).toEqual([ANA])
    await closeEditor()
  },
}

export const NewValueWhileOpenKeepsDrafts: Story = {
  render: () => <ExternalValue />,
  play: async ({ canvasElement }) => {
    const editor = await openEditor(canvasElement)
    await replaceText(
      editor.getByRole('textbox', { name: 'Principal' }),
      'typing@example.com',
    )

    externalValue.set?.([BIA])

    await expect(await within(canvasElement).findByText(BIA)).toBeVisible()
    await expect(draftsOf()).toEqual(['typing@example.com'])
    await closeEditor()
  },
}

export const EditingADraftClearsOnlyItsError: Story = {
  args: { value: [ANA, BIA] },
  play: async ({ args, canvasElement }) => {
    const editor = await openEditor(canvasElement)
    const first = editor.getByRole('textbox', { name: 'Principal' })
    const second = editor.getByRole('textbox', { name: 'Secundário' })

    await replaceText(first, 'ab')
    await replaceText(second, 'cd')
    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual([INVALID, INVALID])

    await userEvent.type(first, 'c@example.com')

    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual([INVALID])
    await expect(first.getAttribute('aria-invalid')).toBeNull()
    await expect(second.getAttribute('aria-invalid')).toBe('true')
    await expect(args.action).not.toHaveBeenCalled()
    await closeEditor()
  },
}

export const AddsAndRemovesDrafts: Story = {
  play: async ({ canvasElement }) => {
    const editor = await openEditor(canvasElement)

    await userEvent.click(
      editor.getByRole('button', { name: 'Adicionar outro' }),
    )
    await expect(draftsOf()).toEqual([ANA, ''])

    await userEvent.click(
      editor.getByRole('button', { name: 'Remover Principal e-mail' }),
    )

    await expect(draftsOf()).toEqual([''])
    await closeEditor()
  },
}

export const AddAnotherOnlyWhileValidAndUnderLimit: Story = {
  play: async ({ canvasElement }) => {
    const editor = await openEditor(canvasElement)
    const addAnother = editor.getByRole('button', { name: 'Adicionar outro' })
    const first = editor.getByRole('textbox', { name: 'Principal' })

    await expect(addAnother).toBeEnabled()

    await replaceText(first, 'ab')
    await expect(addAnother).toBeDisabled()

    await replaceText(first, ANA)
    await expect(addAnother).toBeEnabled()
    await userEvent.click(addAnother)

    await expect(draftsOf()).toHaveLength(2)
    await userEvent.type(
      editor.getByRole('textbox', { name: 'Secundário' }),
      BIA,
    )
    await expect(addAnother).toBeDisabled()
    await closeEditor()
  },
}

export const SavesParsedDraftsWithTheDiff: Story = {
  args: {
    entryLabels: ['Principal', 'Secundário', 'Terciário'],
    value: [ANA, BIA],
  },
  play: async ({ args, canvasElement }) => {
    const editor = await openEditor(canvasElement)

    await userEvent.click(
      editor.getByRole('button', { name: 'Adicionar outro' }),
    )
    await userEvent.type(
      editor.getByRole('textbox', { name: 'Terciário' }),
      CAIO,
    )
    await replaceText(
      editor.getByRole('textbox', { name: 'Principal' }),
      `  ${ANA}  `,
    )
    await replaceText(editor.getByRole('textbox', { name: 'Secundário' }), '')

    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith([ANA, CAIO], {
      added: CAIO,
      previousValue: [ANA, BIA],
      removed: BIA,
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const InvalidDraftKeepsThePopupOpen: Story = {
  args: { value: [] },
  play: async ({ args, canvasElement }) => {
    const editor = await openEditor(canvasElement)

    await userEvent.type(
      editor.getByRole('textbox', { name: 'Principal' }),
      'ab',
    )
    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(args.action).not.toHaveBeenCalled()
    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual([INVALID])
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await closeEditor()
  },
}

export const DuplicateReportedOnTheSecondDraft: Story = {
  args: { value: [] },
  play: async ({ args, canvasElement }) => {
    const editor = await openEditor(canvasElement)

    await userEvent.type(
      editor.getByRole('textbox', { name: 'Principal' }),
      ANA,
    )
    await userEvent.click(
      editor.getByRole('button', { name: 'Adicionar outro' }),
    )
    await userEvent.type(
      editor.getByRole('textbox', { name: 'Secundário' }),
      ANA,
    )
    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(args.action).not.toHaveBeenCalled()
    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual(['Este e-mail já está na lista.'])
    await expect(
      editor
        .getByRole('textbox', { name: 'Principal' })
        .getAttribute('aria-invalid'),
    ).toBeNull()
    await expect(
      editor
        .getByRole('textbox', { name: 'Secundário' })
        .getAttribute('aria-invalid'),
    ).toBe('true')
    await closeEditor()
  },
}
