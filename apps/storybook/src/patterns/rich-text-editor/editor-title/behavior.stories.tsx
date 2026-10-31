import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditorTitle } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    emptyLabel: 'Nota sem título',
    onChange: fn(),
    onEnter: fn(),
  },
  component: EditorTitle,
  decorators: [
    (Story) => (
      <div className="w-2xl max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Editor Title/Behavior',
} satisfies Meta<typeof EditorTitle>

export default meta

type Story = StoryObj<typeof meta>

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

export const CounterAndEnter: Story = {
  args: { counterFrom: 5, defaultValue: 'Phrasal', max: 80 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Título' })
    const counter = canvas.getByText('7/80')
    await expect(field).toHaveAttribute('aria-describedby', counter.id)

    await userEvent.click(field)
    await userEvent.keyboard('{Enter}')
    await expect(args.onEnter).toHaveBeenCalledTimes(1)
  },
}
