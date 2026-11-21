import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { inputControlArgs } from './input-controls.ts'
import { InputCanvas } from './input-frame.tsx'
import {
  CharacterCounterInput,
  CharactersRemainingInput,
  ClearButtonInput,
  ComposedInput,
  EmailForm,
  LabeledInput,
  PasswordStrengthInput,
  PasswordVisibilityInput,
} from './input-layouts.tsx'
import { inputSizeNames } from './input-variants.ts'

interface BehaviorArgs {
  onSubmit: (email: FormDataEntryValue | null) => void
}

const meta = {
  args: { onSubmit: fn() },
  argTypes: { onSubmit: { control: false } },
  decorators: [InputCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Input/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const controlOf = (input: HTMLElement) =>
  input.closest('[data-slot="input-control"]')

export const TypingUpdatesValue: Story = {
  render: () => <ComposedInput {...inputControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Enter text',
    })
    await userEvent.type(input, 'Lemind')
    await expect(input).toHaveValue('Lemind')
  },
}

export const SizesOrderHeights: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {inputSizeNames.map((size) => (
        <ComposedInput
          {...inputControlArgs}
          key={size}
          label={`${size} input`}
          placeholder={size}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = inputSizeNames.map((size) =>
      Number.parseFloat(
        getComputedStyle(canvas.getByRole('textbox', { name: `${size} input` }))
          .height,
      ),
    )
    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(inputSizeNames.length)
  },
}

export const NumberSizeSetsNativeSize: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Input aria-label="Default size" />
      <Input aria-label="Number size" size={10} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reference = canvas.getByRole('textbox', { name: 'Default size' })
    const input = canvas.getByRole('textbox', { name: 'Number size' })
    await expect(input).toHaveAttribute('size', '10')
    await expect(reference).not.toHaveAttribute('size')
    await expect(controlOf(input)).toHaveAttribute('data-size', '10')
    await expect(getComputedStyle(input).height).toBe(
      getComputedStyle(reference).height,
    )
  },
}

export const ClassNameOnWrapper: Story = {
  render: () => (
    <Input aria-label="Enter text" className="max-w-48" size="lg" />
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    const control = controlOf(input)
    await expect(control).toHaveClass('max-w-48')
    await expect(input).not.toHaveClass('max-w-48')
  },
}

export const UnstyledDropsWrapperClasses: Story = {
  render: () => <ComposedInput {...inputControlArgs} unstyled />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    const control = controlOf(input)
    await expect(control).not.toHaveAttribute('class')
    await expect(input.className).not.toBe('')
  },
}

export const LabelNamesInput: Story = {
  render: () => <LabeledInput {...inputControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Label text' })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(input).toHaveFocus()
  },
}

export const DisabledIgnoresTyping: Story = {
  render: () => <ComposedInput {...inputControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await expect(input).toBeDisabled()
    await expect(input).toHaveAttribute('data-disabled')
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
    await userEvent.type(input, 'abc', { pointerEventsCheck: 0 })
    await expect(input).toHaveValue('')
  },
}

export const ValidatesInField: Story = {
  render: ({ onSubmit }) => <EmailForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    const submit = canvas.getByRole('button', { name: 'Submit' })

    await userEvent.type(input, 'team')
    await userEvent.click(submit)
    await expect(
      await canvas.findByText('Please enter a valid email.'),
    ).toBeVisible()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.type(input, '@coss.com')
    await userEvent.click(submit)
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith('team@coss.com'),
    )
  },
}

export const NativeInputSkipsField: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field invalid>
        <FieldLabel>Base UI input</FieldLabel>
        <Input />
      </Field>
      <Field invalid>
        <FieldLabel>Native input</FieldLabel>
        <Input aria-label="Native input" nativeInput />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Base UI input' }),
    ).toHaveAttribute('data-invalid')
    const native = canvas.getByRole('textbox', { name: 'Native input' })
    await expect(native).not.toHaveAttribute('data-invalid')
    await expect(native).not.toHaveAttribute('aria-invalid')
  },
}

export const CounterFollowsValue: Story = {
  render: () => <CharacterCounterInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Username' }),
      'tc96',
    )
    await expect(canvas.getByRole('status')).toHaveTextContent('4/14')
  },
}

export const RemainingFollowsValue: Story = {
  render: () => <CharactersRemainingInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Code' }), 'tc96')
    await expect(canvas.getByText('10')).toBeInTheDocument()
  },
}

export const ToggleShowsPassword: Story = {
  render: () => <PasswordVisibilityInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Password')
    await expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }))
    await expect(input).toHaveAttribute('type', 'text')
  },
}

export const ClearButtonEmptiesValue: Story = {
  render: () => <ClearButtonInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', {
      name: 'City',
    })
    await userEvent.click(canvas.getByRole('button', { name: 'Clear city' }))
    await expect(input).toHaveValue('')
  },
}

export const StrengthFollowsRequirements: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector:
              '*:not([data-theme="light"] [data-requirement="met"]):not([data-theme="light"] [data-requirement="met"] *)',
          },
        ],
      },
    },
  },
  render: () => <PasswordStrengthInput />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Password'), 'Tc96pass')
    await expect(
      canvas.getByRole('progressbar', { name: 'Password strength' }),
    ).toHaveAttribute('aria-valuenow', '4')
    await expect(canvas.getByText(/Strong password/)).toBeInTheDocument()
  },
}
