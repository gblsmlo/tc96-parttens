import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditorTitle } from '@tc96/ui/patterns'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'

const meta = {
  args: {
    emptyLabel: 'Nota sem título',
    onArrowDownAtEnd: fn(),
    onChange: fn(),
    onEnter: fn(),
  },
  component: EditorTitle,
  decorators: [RichTextEditorCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Behavior',
} satisfies Meta<typeof EditorTitle>

export default meta

type Story = StoryObj<typeof meta>

export const TitleAutoFocusesAndNamesTheHeading: Story = {
  args: { autoFocus: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 1 })
    await expect(heading).toHaveAccessibleName('Nota sem título')
    const field = canvas.getByRole('textbox', { name: 'Título' })
    await expect(field).toHaveAttribute('placeholder', 'Nota sem título')
    await waitFor(() => expect(field).toHaveFocus())
  },
}

export const TitleEnterHandsOffInsteadOfBreakingTheLine: Story = {
  args: { autoFocus: true },
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'Título' })
    await waitFor(() => expect(field).toHaveFocus())

    await userEvent.keyboard('Phrasal verbs{Enter}')
    await expect(args.onChange).toHaveBeenLastCalledWith('Phrasal verbs')
    await expect(args.onEnter).toHaveBeenCalledTimes(1)
    await expect(field).toHaveValue('Phrasal verbs')
  },
}

export const TitleArrowDownAtTheEndHandsOff: Story = {
  args: { autoFocus: true },
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'Título' })
    await waitFor(() => expect(field).toHaveFocus())

    await userEvent.keyboard('Phrasal verbs{ArrowDown}')
    await expect(args.onArrowDownAtEnd).toHaveBeenCalledTimes(1)
  },
}

export const EmptyLabelNamesHeadingUntilText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 1 })
    await expect(heading.querySelector('.sr-only')).toHaveTextContent(
      'Nota sem título',
    )

    const field = canvas.getByRole('textbox', { name: 'Título' })
    await userEvent.type(field, 'Phrasal verbs')
    await expect(heading.querySelector('.sr-only')).toBeNull()
    await expect(field).toHaveValue('Phrasal verbs')
  },
}

export const PastedLineBreaksFlatten: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Título',
    })
    await userEvent.click(field)
    await userEvent.paste('Phrasal\n\nverbs')
    await expect(args.onChange).toHaveBeenCalledTimes(1)
    await expect(args.onChange).toHaveBeenCalledWith('Phrasal verbs')
    await expect(field).toHaveValue('Phrasal verbs')
  },
}

export const CounterDescribesTheField: Story = {
  args: { counterFrom: 5, defaultValue: 'Phrasal', max: 80 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Título' })
    const counter = canvas.getByText('7/80')
    await expect(field).toHaveAttribute('aria-describedby', counter.id)
  },
}

export const CounterAppearsFromCounterFrom: Story = {
  args: { counterFrom: 10, defaultValue: 'Phrasal', max: 80 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Título' })
    await expect(
      canvasElement.querySelector('[data-slot=editor-title-counter]'),
    ).toBeNull()
    await expect(field).not.toHaveAttribute('aria-describedby')

    await userEvent.type(field, ' verbs')
    await expect(await canvas.findByText('13/80')).toBeVisible()
  },
}

export const MaxStopsTheTitle: Story = {
  args: { max: 5 },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'Título' })
    await userEvent.type(field, 'Phrasal')
    await expect(field).toHaveValue('Phras')
  },
}
