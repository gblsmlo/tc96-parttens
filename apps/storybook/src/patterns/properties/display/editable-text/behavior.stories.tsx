import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableText } from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { EditableTextCanvas } from './editable-text-canvas.tsx'
import { editableTextControlArgs } from './editable-text-controls.ts'
import {
  ComposedEditableText,
  StatefulEditableText,
} from './editable-text-layouts.tsx'

const meta = {
  args: {
    ariaLabel: 'Título',
    onCommit: fn((_value: string | null) => {}),
    value: 'Contrato',
  },
  component: EditableText,
  decorators: [EditableTextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/EditableText/Behavior',
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
  render: (args) => <StatefulEditableText {...args} />,
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado')
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('Contrato assinado')

    await userEvent.click(field)
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledOnce()
  },
}

export const EnterCommitsSingleLineOnce: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado{Enter}')

    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('Contrato assinado')
  },
}

export const EnterDoesNotCommitMultiline: Story = {
  render: ({ onCommit }) => (
    <ComposedEditableText
      {...editableTextControlArgs}
      ariaLabel="Descrição"
      multiline
      onCommit={onCommit}
      value="Resumo"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement, 'Descrição')

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Resumo do documento{Enter}')

    await expect(field.tagName).toBe('TEXTAREA')
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

export const TrimsCommittedText: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, '  Contrato assinado  ')
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('Contrato assinado')
  },
}

export const TrimmedSameTextCommitsNothing: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.type(field, '  ')
    await userEvent.tab()

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

    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith(null)
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

export const UntouchedEmptyValueCommitsNothing: Story = {
  args: {
    emptyValue: 'Sem título',
    revertWhenEmpty: true,
    value: 'Sem título',
  },
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await expect(field.value).toBe('')
    await userEvent.tab()

    await expect(field.value).toBe('Sem título')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const CommittedDraftStaysUntilValueChanges: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado')
    await userEvent.tab()

    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(field.value).toBe('Contrato assinado')
  },
}

export const EscapeReachesDialogOnlyWithoutDraft: Story = {
  play: async ({ args, canvasElement }) => {
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

      await expect(onDialogEscape).toHaveBeenCalledOnce()
      await expect(args.onCommit).not.toHaveBeenCalled()
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

      await expect(onDialogEscape).toHaveBeenCalledOnce()
      await expect(args.onCommit).not.toHaveBeenCalled()
    } finally {
      stop()
    }
  },
}

export const FocusesOnMountWithAutoFocus: Story = {
  args: { autoFocus: true },
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field).toHaveFocus()
    await expect(field).toHaveAttribute('data-editing')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const ReachableByKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await userEvent.tab()
    await expect(field).toHaveFocus()
    await userEvent.keyboard('{End} assinado{Enter}')

    await expect(args.onCommit).toHaveBeenCalledOnce()
    await expect(args.onCommit).toHaveBeenLastCalledWith('Contrato assinado')
  },
}

const fontSizeOf = (field: HTMLElement) => getComputedStyle(field).fontSize

export const DefaultSizeIsSixteenPixels: Story = {
  render: ({ onCommit }) => (
    <ComposedEditableText {...editableTextControlArgs} onCommit={onCommit} />
  ),
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field.className).toContain('text-base')
    await expect(fontSizeOf(field)).toBe('16px')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const SizeSmSetsFourteenPixels: Story = {
  render: ({ onCommit }) => (
    <ComposedEditableText
      {...editableTextControlArgs}
      onCommit={onCommit}
      size="sm"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field.className).toContain('text-sm')
    await expect(fontSizeOf(field)).toBe('14px')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const SizeLgSetsTwentyFourPixels: Story = {
  render: ({ onCommit }) => (
    <ComposedEditableText
      {...editableTextControlArgs}
      onCommit={onCommit}
      size="lg"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field.className).toContain('text-2xl')
    await expect(fontSizeOf(field)).toBe('24px')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const SizeXlSetsThirtyTwoPixels: Story = {
  render: ({ onCommit }) => (
    <ComposedEditableText
      {...editableTextControlArgs}
      onCommit={onCommit}
      size="xl"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field.className).toContain('text-[2rem]')
    await expect(fontSizeOf(field)).toBe('32px')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const EmptyValueShowsThePlaceholder: Story = {
  render: ({ onCommit }) => (
    <ComposedEditableText
      {...editableTextControlArgs}
      onCommit={onCommit}
      value=""
    />
  ),
  play: async ({ args, canvasElement }) => {
    const field = fieldIn(canvasElement)

    await expect(field.value).toBe('')
    await expect(field.placeholder).toBe('Sem título')
    await expect(field).toHaveAttribute('data-empty')
    await expect(field.classList.contains('text-muted-foreground')).toBe(true)
    await expect(args.onCommit).not.toHaveBeenCalled()
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
    await expect(canvas.queryByRole('textbox')).toBeNull()
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
