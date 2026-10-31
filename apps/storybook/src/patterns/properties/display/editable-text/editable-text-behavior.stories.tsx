import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableText } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    ariaLabel: 'Título',
    onCommit: fn((_value: string | null) => {}),
    value: 'Contrato',
  },
  component: EditableText,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Editable Text/Behavior',
} satisfies Meta<typeof EditableText>

export default meta

type Story = StoryObj<typeof meta>

const fieldIn = (canvasElement: HTMLElement, name = 'Título') =>
  within(canvasElement).getByLabelText<HTMLInputElement>(name)

const listenForDialogEscape = () => {
  const onDialogEscape = fn()
  const listener = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onDialogEscape()
  }
  document.addEventListener('keydown', listener)

  return {
    onDialogEscape,
    stop: () => document.removeEventListener('keydown', listener),
  }
}

export const DoesNotCommitWhileTyping: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado')

    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const CommitsOnceOnBlur: Story = {
  render: function Confirmed({ onCommit, ...args }) {
    const [value, setValue] = useState(args.value)

    return (
      <EditableText
        {...args}
        onCommit={(next) => {
          onCommit(next)
          setValue(next)
        }}
        value={value}
      />
    )
  },
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado')
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledTimes(1)
    await expect(args.onCommit).toHaveBeenCalledWith('Contrato assinado')

    await userEvent.click(field)
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledTimes(1)
  },
}

export const EnterCommitsSingleLineOnce: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado{Enter}')

    await expect(args.onCommit).toHaveBeenCalledTimes(1)
    await expect(args.onCommit).toHaveBeenCalledWith('Contrato assinado')
  },
}

export const EnterDoesNotCommitMultiline: Story = {
  args: { ariaLabel: 'Descrição', multiline: true, value: 'Resumo' },
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement, 'Descrição')

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Resumo do documento{Enter}')

    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const EscapeRestoresConfirmedValue: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Rascunho descartado{Escape}')

    await expect(field.value).toBe('Contrato')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const EmptiesIntoNull: Story = {
  args: { ariaLabel: 'E-mail', value: 'ana@jars.test' },
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement, 'E-mail')

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, '  ')
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledWith(null)
  },
}

export const RevertsUnderRevertWhenEmpty: Story = {
  args: { revertWhenEmpty: true },
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.tab()

    await expect(field.value).toBe('Contrato')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const ClearsEmptyValueOnFocus: Story = {
  args: {
    emptyValue: 'Sem título',
    revertWhenEmpty: true,
    value: 'Sem título',
  },
  play: async ({ canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)

    await expect(field.value).toBe('')
  },
}

export const EscapeReachesDialogOnlyWithoutDraft: Story = {
  play: async ({ canvasElement }) => {
    const { onDialogEscape, stop } = listenForDialogEscape()

    try {
      const field = fieldIn(canvasElement)

      await userEvent.click(field)
      await userEvent.clear(field)
      await userEvent.type(field, 'Rascunho descartado')
      await userEvent.keyboard('{Escape}')

      await expect(field.value).toBe('Contrato')
      await expect(onDialogEscape).not.toHaveBeenCalled()

      await userEvent.click(field)
      await userEvent.keyboard('{Escape}')

      await expect(onDialogEscape).toHaveBeenCalledTimes(1)
    } finally {
      stop()
    }
  },
}

export const EscapeNotSwallowedAfterEmptyValueClearing: Story = {
  args: {
    emptyValue: 'Sem título',
    revertWhenEmpty: true,
    value: 'Sem título',
  },
  play: async ({ args, canvasElement }) => {
    const { onDialogEscape, stop } = listenForDialogEscape()

    try {
      const field = fieldIn(canvasElement)

      await userEvent.click(field)
      await expect(field.value).toBe('')

      await userEvent.keyboard('{Escape}')

      await expect(onDialogEscape).toHaveBeenCalledTimes(1)
      await expect(args.onCommit).not.toHaveBeenCalled()
    } finally {
      stop()
    }
  },
}

export const SizesMapToScale: Story = {
  render: ({ onCommit }) => (
    <div className="grid gap-2">
      <EditableText ariaLabel="sm" onCommit={onCommit} size="sm" value="a" />
      <EditableText
        ariaLabel="base"
        onCommit={onCommit}
        size="base"
        value="a"
      />
      <EditableText ariaLabel="lg" onCommit={onCommit} size="lg" value="a" />
      <EditableText ariaLabel="xl" onCommit={onCommit} size="xl" value="a" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(fieldIn(canvasElement, 'sm').className).toContain('text-sm')
    await expect(fieldIn(canvasElement, 'base').className).toContain(
      'text-base',
    )
    await expect(fieldIn(canvasElement, 'lg').className).toContain('text-2xl')
    await expect(fieldIn(canvasElement, 'xl').className).toContain(
      'text-[2rem]',
    )
  },
}

export const ReadOnlyRendersText: Story = {
  args: {
    ariaLabel: 'E-mail',
    placeholder: 'Sem e-mail',
    readOnly: true,
    value: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByLabelText('E-mail')).toBeNull()
    await expect(canvas.getByText('Sem e-mail')).toBeInTheDocument()
  },
}

export const DomainDefaultReadsAsPlaceholder: Story = {
  args: { emptyValue: 'Sem título', value: 'Sem título' },
  play: async ({ canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field.classList.contains('text-muted-foreground')).toBe(true)

    await userEvent.click(field)
    await userEvent.type(field, 'Contrato assinado')

    await expect(field.classList.contains('text-muted-foreground')).toBe(false)
  },
}
