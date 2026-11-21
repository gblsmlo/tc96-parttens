import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@tc96/ui/number-field'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { numberFieldControlArgs } from './number-field-controls.ts'
import { NumberFieldCanvas } from './number-field-frame.tsx'
import {
  ComposedNumberField,
  FieldNumberField,
  LabeledNumberField,
  QuantityForm,
} from './number-field-layouts.tsx'
import { numberFieldSizeNames } from './number-field-variants.ts'

interface BehaviorArgs {
  onSubmit: (quantity: FormDataEntryValue | null) => void
  onValueChange: (value: number | null, eventDetails: unknown) => void
  onValueCommitted: (value: number | null, eventDetails: unknown) => void
}

const meta = {
  args: { onSubmit: fn(), onValueChange: fn(), onValueCommitted: fn() },
  argTypes: {
    onSubmit: { control: false },
    onValueChange: { control: false },
    onValueCommitted: { control: false },
  },
  decorators: [NumberFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/NumberField/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const ringShadow = /0px 0px 0px 3px/

const groupOf = (input: HTMLElement) =>
  input.closest<HTMLElement>('[data-slot="number-field-group"]')

const rootOf = (input: HTMLElement) =>
  input.closest<HTMLElement>('[data-slot="number-field"]')

export const InputAnnouncedAsNumberField: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    await expect(input).toHaveAttribute('aria-roledescription', 'Number field')
    await expect(input).toHaveAttribute('inputmode', 'numeric')
    await expect(input).toHaveValue('0')
  },
}

export const ScrubAreaLabelNamesInput: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} scrubArea />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    const scrubArea = canvasElement.querySelector(
      '[data-slot="number-field-scrub-area"]',
    )
    await expect(scrubArea?.querySelector('label')).toHaveAttribute(
      'for',
      input.id,
    )
  },
}

export const IdNamesInputForLabel: Story = {
  render: () => <LabeledNumberField {...numberFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Label text' })
    await expect(rootOf(input)).not.toHaveAttribute('id')
  },
}

export const NamedByFieldLabel: Story = {
  render: () => <FieldNumberField {...numberFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Label text',
    })
    await expect(input).toHaveAccessibleDescription('Help text for the value.')
  },
}

export const ButtonsStepByStep: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} step={5} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    const increase = canvas.getByRole('button', { name: 'Increase' })
    await userEvent.click(increase)
    await userEvent.click(increase)
    await expect(input).toHaveValue('10')
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }))
    await expect(input).toHaveValue('5')
  },
}

export const ButtonsReportReasons: Story = {
  render: ({ onValueChange, onValueCommitted }) => (
    <ComposedNumberField
      {...numberFieldControlArgs}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      1,
      expect.objectContaining({ reason: 'increment-press' }),
    )
    await waitFor(() =>
      expect(args.onValueCommitted).toHaveBeenLastCalledWith(
        1,
        expect.objectContaining({ reason: 'increment-press' }),
      ),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }))
    await expect(args.onValueChange).toHaveBeenCalledTimes(2)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      0,
      expect.objectContaining({ reason: 'decrement-press' }),
    )
    await waitFor(() =>
      expect(args.onValueCommitted).toHaveBeenLastCalledWith(
        0,
        expect.objectContaining({ reason: 'decrement-press' }),
      ),
    )
  },
}

export const SteppersSkipTabOrder: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    const decrease = canvas.getByRole('button', { name: 'Decrease' })
    const increase = canvas.getByRole('button', { name: 'Increase' })
    await expect(decrease).toHaveAttribute('tabindex', '-1')
    await expect(increase).toHaveAttribute('tabindex', '-1')
    await expect(increase).toHaveAttribute('aria-controls', input.id)
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
    await expect(increase).not.toHaveFocus()
  },
}

export const StepperNamesReplaceable: Story = {
  render: () => (
    <NumberField defaultValue={0}>
      <NumberFieldGroup>
        <NumberFieldDecrement aria-label="Remove one guest" />
        <NumberFieldInput aria-label="Guests" />
        <NumberFieldIncrement aria-label="Add one guest" />
      </NumberFieldGroup>
    </NumberField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('button')).toHaveLength(2)
    await expect(
      canvas.queryByRole('button', { name: 'Increase' }),
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole('button', { name: 'Decrease' }),
    ).not.toBeInTheDocument()
  },
}

export const ArrowKeysStep: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} step={5} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(input).toHaveValue('5')
    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}')
    await expect(input).toHaveValue('15')
    await userEvent.keyboard('{ArrowDown}')
    await expect(input).toHaveValue('10')
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}')
    await expect(input).toHaveValue('10.1')
  },
}

export const HomeAndEndJumpToBounds: Story = {
  render: () => (
    <ComposedNumberField
      {...numberFieldControlArgs}
      defaultValue={5}
      max={10}
      min={0}
    />
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(input).toHaveValue('10')
    await userEvent.keyboard('{Home}')
    await expect(input).toHaveValue('0')
  },
}

export const SteppersDisabledAtBounds: Story = {
  render: () => (
    <ComposedNumberField
      {...numberFieldControlArgs}
      defaultValue={10}
      max={10}
      min={9}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    const decrease = canvas.getByRole('button', { name: 'Decrease' })
    const increase = canvas.getByRole('button', { name: 'Increase' })
    await expect(increase).toHaveAttribute('data-disabled')
    await expect(decrease).not.toHaveAttribute('data-disabled')
    await userEvent.click(decrease)
    await expect(input).toHaveValue('9')
    await expect(decrease).toHaveAttribute('data-disabled')
    await expect(increase).not.toHaveAttribute('data-disabled')
  },
}

export const ClampsTypedValueOnBlur: Story = {
  render: () => (
    <ComposedNumberField {...numberFieldControlArgs} max={10} min={0} />
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    await userEvent.clear(input)
    await userEvent.type(input, '50')
    await expect(input).toHaveValue('50')
    await userEvent.tab()
    await expect(input).toHaveValue('10')
  },
}

export const IgnoresNonNumericCharacters: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    await userEvent.clear(input)
    await userEvent.type(input, '4a2!')
    await expect(input).toHaveValue('42')
  },
}

export const FormatsOnBlur: Story = {
  render: () => (
    <ComposedNumberField
      {...numberFieldControlArgs}
      format="currency"
      label="Price"
      locale="en-US"
    />
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Price' })
    await expect(input).toHaveValue('$0.00')
    await userEvent.clear(input)
    await userEvent.type(input, '1234.5')
    await expect(input).toHaveValue('1234.5')
    await userEvent.tab()
    await expect(input).toHaveValue('$1,234.50')
  },
}

export const CommitsOnBlur: Story = {
  render: ({ onValueChange, onValueCommitted }) => (
    <ComposedNumberField
      {...numberFieldControlArgs}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    await userEvent.clear(input)
    await userEvent.type(input, '42')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      42,
      expect.objectContaining({ reason: 'input-change' }),
    )
    await expect(args.onValueCommitted).not.toHaveBeenCalled()
    await userEvent.tab()
    await expect(args.onValueCommitted).toHaveBeenCalledOnce()
    await expect(args.onValueCommitted).toHaveBeenLastCalledWith(
      42,
      expect.objectContaining({ reason: 'input-blur' }),
    )
  },
}

export const DisabledIgnoresInput: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    const increase = canvas.getByRole('button', { name: 'Increase' })
    await expect(input).toBeDisabled()
    await expect(groupOf(input)).toHaveAttribute('data-disabled')
    await expect(increase).toHaveAttribute('data-disabled')
    await expect(getComputedStyle(increase).pointerEvents).toBe('none')
    increase.click()
    await expect(input).toHaveValue('0')
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
  },
}

export const ReadOnlyKeepsValue: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} readOnly />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    await expect(input).toHaveAttribute('readonly')
    await expect(rootOf(input)).toHaveAttribute('data-readonly')
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await expect(input).toHaveValue('0')
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(input).toHaveValue('0')
  },
}

export const InvalidMarksGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ComposedNumberField {...numberFieldControlArgs} label="Valid" />
      <ComposedNumberField
        {...numberFieldControlArgs}
        invalid
        label="Invalid"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const valid = canvas.getByRole('textbox', { name: 'Valid' })
    const invalid = canvas.getByRole('textbox', { name: 'Invalid' })
    const validGroup = groupOf(valid)
    const invalidGroup = groupOf(invalid)
    if (!(validGroup && invalidGroup)) throw new Error('Missing group')
    await expect(getComputedStyle(invalidGroup).borderTopColor).not.toBe(
      getComputedStyle(validGroup).borderTopColor,
    )
  },
}

export const FocusRingOnGroup: Story = {
  render: () => <ComposedNumberField {...numberFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Quantity',
    })
    const group = groupOf(input)
    if (!group) throw new Error('Missing group')
    await expect(getComputedStyle(group).boxShadow).not.toMatch(ringShadow)
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(group).boxShadow).toMatch(ringShadow),
    )
  },
}

export const SizesOrderHeights: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {numberFieldSizeNames.map((size) => (
        <ComposedNumberField
          {...numberFieldControlArgs}
          key={size}
          label={`${size} quantity`}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = numberFieldSizeNames.map((size) =>
      Number.parseFloat(
        getComputedStyle(
          canvas.getByRole('textbox', { name: `${size} quantity` }),
        ).height,
      ),
    )
    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(numberFieldSizeNames.length)
  },
}

export const EmptyRequiredBlocksSubmit: Story = {
  render: ({ onSubmit }) => <QuantityForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Quantity' })
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }))
    await expect(
      await canvas.findByText('Please enter a quantity from 1 to 100.'),
    ).toBeVisible()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const SubmitsUnderFieldName: Story = {
  render: ({ onSubmit }) => <QuantityForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Quantity' }), '5')
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenLastCalledWith('5')
  },
}
