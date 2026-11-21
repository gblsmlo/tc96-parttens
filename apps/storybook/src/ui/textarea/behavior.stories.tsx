import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Textarea } from '@tc96/ui/textarea'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { textareaControlArgs } from './textarea-controls.ts'
import { TextareaCanvas } from './textarea-frame.tsx'
import {
  ComposedTextarea,
  FieldTextarea,
  LabeledTextarea,
  SupportForm,
} from './textarea-layouts.tsx'
import { textareaSizeNames } from './textarea-variants.ts'

interface BehaviorArgs {
  onSubmit: (message: FormDataEntryValue | null) => void
}

const meta = {
  args: { onSubmit: fn() },
  argTypes: { onSubmit: { control: false } },
  decorators: [TextareaCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Textarea/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const controlOf = (textarea: HTMLElement) =>
  textarea.closest('[data-slot="textarea-control"]')

const heightOf = (element: HTMLElement) =>
  Number.parseFloat(getComputedStyle(element).height)

export const EnterAddsLineInForm: Story = {
  render: ({ onSubmit }) => <SupportForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    })
    await userEvent.type(textarea, 'First line{Enter}Second line{Enter}')
    await expect(textarea).toHaveValue('First line\nSecond line\n')
    await expect(textarea).not.toHaveAttribute('data-valid')
    await expect(textarea).not.toHaveAttribute('data-invalid')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const GrowsWithContent: Story = {
  render: () => <ComposedTextarea {...textareaControlArgs} />,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    })
    const emptyHeight = heightOf(textarea)
    await userEvent.type(textarea, 'One{Enter}Two{Enter}Three{Enter}Four')
    await waitFor(() => expect(heightOf(textarea)).toBeGreaterThan(emptyHeight))
    await userEvent.clear(textarea)
    await waitFor(() => expect(heightOf(textarea)).toBe(emptyHeight))
  },
}

export const RowsKeepContentHeight: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Textarea aria-label="Without rows" />
      <Textarea aria-label="Eight rows" rows={8} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      heightOf(canvas.getByRole('textbox', { name: 'Eight rows' })),
    ).toBe(heightOf(canvas.getByRole('textbox', { name: 'Without rows' })))
  },
}

export const SizesOrderHeights: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {textareaSizeNames.map((size) => (
        <ComposedTextarea
          {...textareaControlArgs}
          key={size}
          label={`${size} textarea`}
          placeholder={size}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = textareaSizeNames.map((size) =>
      heightOf(canvas.getByRole('textbox', { name: `${size} textarea` })),
    )
    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(textareaSizeNames.length)
  },
}

export const NumberSizeKeepsDefaultLook: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Textarea aria-label="Default size" />
      <Textarea aria-label="Number size" size={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reference = canvas.getByRole('textbox', { name: 'Default size' })
    const textarea = canvas.getByRole('textbox', { name: 'Number size' })
    await expect(controlOf(textarea)).toHaveAttribute('data-size', '4')
    await expect(textarea).not.toHaveAttribute('rows')
    await expect(textarea).not.toHaveAttribute('size')
    await expect(heightOf(textarea)).toBe(heightOf(reference))
  },
}

export const ClassNameOnWrapper: Story = {
  render: () => <Textarea aria-label="Message" className="max-w-48" />,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox')
    await expect(controlOf(textarea)).toHaveClass('max-w-48')
    await expect(textarea).not.toHaveClass('max-w-48')
  },
}

export const StyleOnTextarea: Story = {
  render: () => (
    <Textarea aria-label="Message" style={{ minHeight: '160px' }} />
  ),
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox')
    await expect(textarea).toHaveStyle({ minHeight: '160px' })
    await expect(controlOf(textarea)).not.toHaveAttribute('style')
  },
}

export const UnstyledDropsWrapperClasses: Story = {
  render: () => <ComposedTextarea {...textareaControlArgs} unstyled />,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox')
    await expect(controlOf(textarea)).not.toHaveAttribute('class')
    await expect(textarea.className).not.toBe('')
  },
}

export const LabelNamesTextarea: Story = {
  render: () => <LabeledTextarea {...textareaControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: 'Label text' })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(textarea).toHaveFocus()
  },
}

export const DisabledSetsDataDisabled: Story = {
  render: () => <ComposedTextarea {...textareaControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox')
    await expect(textarea).toBeDisabled()
    await expect(textarea).toHaveAttribute('data-disabled')
  },
}

export const FieldDisablesTextarea: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Delivery notes</FieldLabel>
      <Textarea />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', {
      name: 'Delivery notes',
    })
    await expect(textarea).toBeDisabled()
    await expect(textarea).toHaveAttribute('data-disabled')
  },
}

export const DescriptionDescribesTextarea: Story = {
  render: () => <FieldTextarea {...textareaControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Label text' }),
    ).toHaveAccessibleDescription('Describe what the field is for.')
  },
}

export const FieldStateAttributes: Story = {
  render: () => (
    <Field validationMode="onBlur">
      <FieldLabel>Notes</FieldLabel>
      <Textarea />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', {
      name: 'Notes',
    })
    await expect(textarea).not.toHaveAttribute('data-focused')
    await expect(textarea).not.toHaveAttribute('data-filled')

    await userEvent.click(textarea)
    await expect(textarea).toHaveAttribute('data-focused')
    await expect(textarea).not.toHaveAttribute('data-dirty')

    await userEvent.type(textarea, 'Call before noon')
    await expect(textarea).toHaveAttribute('data-dirty')
    await expect(textarea).toHaveAttribute('data-filled')
    await expect(textarea).not.toHaveAttribute('data-touched')
    await expect(textarea).not.toHaveAttribute('data-valid')

    await userEvent.tab()
    await expect(textarea).not.toHaveAttribute('data-focused')
    await expect(textarea).toHaveAttribute('data-touched')
    await expect(textarea).toHaveAttribute('data-valid')
  },
}

export const RequiredBlocksSubmit: Story = {
  render: ({ onSubmit }) => <SupportForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(
      await canvas.findByText('Please describe the problem.'),
    ).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const InvalidAfterFailedSubmit: Story = {
  render: ({ onSubmit }) => <SupportForm onSubmit={onSubmit} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: 'Message' })
    await expect(textarea).not.toHaveAttribute('aria-invalid')
    await expect(textarea).not.toHaveAttribute('data-invalid')
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await waitFor(() =>
      expect(textarea).toHaveAttribute('aria-invalid', 'true'),
    )
    await expect(textarea).toHaveAttribute('data-invalid')
  },
}

export const SubmitsValueWithForm: Story = {
  render: ({ onSubmit }) => <SupportForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Message' }),
      'The export{Enter}drops the time zone.',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith(
        'The export\ndrops the time zone.',
      ),
    )
  },
}
