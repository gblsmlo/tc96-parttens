import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { otpFieldControlArgs } from './otp-field-controls.ts'
import { OTPFieldCanvas } from './otp-field-frame.tsx'
import {
  ComposedOTPField,
  RecoveryCodeField,
  TwoFactorForm,
} from './otp-field-layouts.tsx'
import { otpFieldSizeNames } from './otp-field-variants.ts'

interface BehaviorArgs {
  onValueChange: (value: string) => void
  onValueComplete: (value: string) => void
  onValueInvalid: (value: string) => void
  onVerify: (code: string) => void
}

const meta = {
  args: {
    onValueChange: fn(),
    onValueComplete: fn(),
    onValueInvalid: fn(),
    onVerify: fn(),
  },
  argTypes: {
    onValueChange: { control: false },
    onValueComplete: { control: false },
    onValueInvalid: { control: false },
    onVerify: { control: false },
  },
  decorators: [OTPFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/OTPField/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const slotsOf = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]'),
  )

const rootOf = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('[data-slot="otp-field"]')

const codeOf = (root: HTMLElement) =>
  slotsOf(root)
    .map((slot) => slot.value)
    .join('')

export const LabelNamesGroupAndSlots: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Verification code' })
    const slots = within(group).getAllByRole('textbox')
    await expect(slots).toHaveLength(6)
    await expect(slots[0]).toHaveAccessibleName('Verification code')
    await expect(slots[1]).toHaveAccessibleName('Character 2 of 6')
    await expect(slots[5]).toHaveAccessibleName('Character 6 of 6')
  },
}

export const TypingMovesToNextSlot: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('4')
    await expect(slots[0]).toHaveValue('4')
    await waitFor(() => expect(slots[1]).toHaveFocus())
    await userEvent.keyboard('8')
    await expect(slots[1]).toHaveValue('8')
    await waitFor(() => expect(slots[2]).toHaveFocus())
  },
}

export const FocusStaysOnFirstEmptySlot: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} />,
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[5] as HTMLInputElement)
    await expect(slots[0]).toHaveFocus()
    await userEvent.keyboard('48')
    await waitFor(() => expect(slots[2]).toHaveFocus())
    await userEvent.click(slots[5] as HTMLInputElement)
    await expect(slots[2]).toHaveFocus()
  },
}

export const PasteFillsSlots: Story = {
  render: ({ onValueChange }) => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      onValueChange={onValueChange}
      separator
    />
  ),
  play: async ({ args, canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.paste('482 913')
    await expect(codeOf(canvasElement)).toBe('482913')
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      '482913',
      expect.objectContaining({ reason: 'input-paste' }),
    )
    await waitFor(() => expect(slots[5]).toHaveFocus())
  },
}

export const BackspaceErasesPreviousSlot: Story = {
  render: () => (
    <ComposedOTPField {...otpFieldControlArgs} defaultValue="482" />
  ),
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[3] as HTMLInputElement)
    await expect(slots[3]).toHaveFocus()
    await userEvent.keyboard('{Backspace}')
    await expect(codeOf(canvasElement)).toBe('48')
    await waitFor(() => expect(slots[2]).toHaveFocus())
  },
}

export const CtrlBackspaceClearsCode: Story = {
  render: () => (
    <ComposedOTPField {...otpFieldControlArgs} defaultValue="482" />
  ),
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[3] as HTMLInputElement)
    await expect(slots[3]).toHaveFocus()
    await userEvent.keyboard('{Control>}{Backspace}{/Control}')
    await expect(codeOf(canvasElement)).toBe('')
    await waitFor(() => expect(slots[0]).toHaveFocus())
  },
}

export const ArrowKeysMoveFocus: Story = {
  render: () => (
    <ComposedOTPField {...otpFieldControlArgs} defaultValue="4829" />
  ),
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('{ArrowRight}')
    await expect(slots[1]).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(slots[4]).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(slots[3]).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(slots[0]).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(slots[0]).toHaveFocus()
    await expect(codeOf(canvasElement)).toBe('4829')
  },
}

export const SingleTabStop: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} defaultValue="48" />,
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    const tabbable = slots.filter((slot) => slot.tabIndex === 0)
    await expect(tabbable).toEqual([slots[2]])
    await userEvent.tab()
    await expect(slots[2]).toHaveFocus()
    await userEvent.tab()
    for (const slot of slots) {
      await expect(slot).not.toHaveFocus()
    }
  },
}

export const NumericRejectsLetters: Story = {
  render: ({ onValueInvalid }) => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      onValueInvalid={onValueInvalid}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('a')
    await expect(codeOf(canvasElement)).toBe('')
    await expect(args.onValueInvalid).toHaveBeenCalledOnce()
    await expect(args.onValueInvalid).toHaveBeenLastCalledWith(
      'a',
      expect.objectContaining({ reason: 'input-change' }),
    )
    await userEvent.keyboard('4')
    await expect(codeOf(canvasElement)).toBe('4')
  },
}

export const AlphanumericAcceptsLetters: Story = {
  render: ({ onValueInvalid }) => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      onValueInvalid={onValueInvalid}
      validationType="alphanumeric"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('k7-q')
    await expect(codeOf(canvasElement)).toBe('k7q')
    await expect(args.onValueInvalid).toHaveBeenCalledOnce()
    await expect(args.onValueInvalid).toHaveBeenLastCalledWith(
      '-',
      expect.anything(),
    )
  },
}

export const InputModeFollowsValidationType: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ComposedOTPField {...otpFieldControlArgs} label="Numeric code" />
      <ComposedOTPField
        {...otpFieldControlArgs}
        label="Alphanumeric code"
        validationType="alphanumeric"
      />
      <ComposedOTPField
        {...otpFieldControlArgs}
        label="Free code"
        validationType="none"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slotsIn = (name: string) =>
      within(canvas.getByRole('group', { name })).getAllByRole('textbox')
    for (const slot of slotsIn('Numeric code')) {
      await expect(slot).toHaveAttribute('inputmode', 'numeric')
    }
    for (const slot of slotsIn('Alphanumeric code')) {
      await expect(slot).toHaveAttribute('inputmode', 'text')
    }
    for (const slot of slotsIn('Free code')) {
      await expect(slot).not.toHaveAttribute('inputmode')
    }
  },
}

export const NormalizeValueTransformsCode: Story = {
  render: () => <RecoveryCodeField />,
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.paste('k7q2-m9x4')
    await expect(codeOf(canvasElement)).toBe('K7Q2M9X4')
  },
}

export const CompleteCallsOnValueComplete: Story = {
  render: ({ onValueChange, onValueComplete }) => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      onValueChange={onValueChange}
      onValueComplete={onValueComplete}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('48291')
    await expect(args.onValueComplete).not.toHaveBeenCalled()
    await userEvent.keyboard('3')
    await waitFor(() => expect(args.onValueComplete).toHaveBeenCalledOnce())
    await expect(args.onValueComplete).toHaveBeenLastCalledWith(
      '482913',
      expect.objectContaining({ reason: 'input-change' }),
    )
    await expect(args.onValueChange).toHaveBeenCalledTimes(6)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      '482913',
      expect.anything(),
    )
  },
}

export const AutoSubmitSendsCode: Story = {
  render: ({ onVerify }) => <TwoFactorForm onVerify={onVerify} />,
  play: async ({ args, canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('48291')
    await expect(args.onVerify).not.toHaveBeenCalled()
    await userEvent.keyboard('3')
    await waitFor(() => expect(args.onVerify).toHaveBeenCalledOnce())
    await expect(args.onVerify).toHaveBeenLastCalledWith('482913')
  },
}

export const MaskHidesCharacters: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} mask />,
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    for (const slot of slots) {
      await expect(slot).toHaveAttribute('type', 'password')
    }
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('48')
    await expect(codeOf(canvasElement)).toBe('48')
  },
}

export const DisabledIgnoresInput: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await expect(rootOf(canvasElement)).toHaveAttribute('data-disabled')
    for (const slot of slots) {
      await expect(slot).toBeDisabled()
    }
    await userEvent.tab()
    for (const slot of slots) {
      await expect(slot).not.toHaveFocus()
    }
  },
}

export const ReadOnlyKeepsCode: Story = {
  render: ({ onValueChange }) => (
    <ComposedOTPField
      {...otpFieldControlArgs}
      defaultValue="4829"
      onValueChange={onValueChange}
      readOnly
    />
  ),
  play: async ({ args, canvasElement }) => {
    const slots = slotsOf(canvasElement)
    await expect(rootOf(canvasElement)).toHaveAttribute('data-readonly')
    await userEvent.click(slots[1] as HTMLInputElement)
    await expect(slots[1]).toHaveFocus()
    await userEvent.keyboard('7{Backspace}{Delete}')
    await userEvent.paste('1111')
    await expect(codeOf(canvasElement)).toBe('4829')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const InvalidMarksEverySlot: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} invalid />,
  play: async ({ canvasElement }) => {
    await expect(rootOf(canvasElement)).toHaveAttribute('data-invalid')
    for (const slot of slotsOf(canvasElement)) {
      await expect(slot).toHaveAttribute('aria-invalid', 'true')
      await expect(slot).toHaveAttribute('data-invalid')
    }
  },
}

export const FilledAndCompleteState: Story = {
  render: () => (
    <ComposedOTPField {...otpFieldControlArgs} defaultValue="48291" />
  ),
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement)
    const slots = slotsOf(canvasElement)
    await expect(root).toHaveAttribute('data-filled')
    await expect(root).not.toHaveAttribute('data-complete')
    await expect(slots.map((slot) => slot.hasAttribute('data-filled'))).toEqual(
      [true, true, true, true, true, false],
    )
    await userEvent.click(slots[5] as HTMLInputElement)
    await userEvent.keyboard('3')
    await waitFor(() => expect(root).toHaveAttribute('data-complete'))
    await expect(slots[5]).toHaveAttribute('data-filled')
  },
}

export const LargeSizeIsTaller: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {otpFieldSizeNames.map((size) => (
        <ComposedOTPField
          {...otpFieldControlArgs}
          key={size}
          label={`${size} code`}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = otpFieldSizeNames.map((size) => {
      const group = canvas.getByRole('group', { name: `${size} code` })
      return within(group).getAllByRole('textbox')[0]?.getBoundingClientRect()
        .height
    })
    await expect(heights[1]).toBeGreaterThan(heights[0] ?? 0)
    for (const size of otpFieldSizeNames) {
      await expect(
        canvas.getByRole('group', { name: `${size} code` }),
      ).toHaveAttribute('data-size', size)
    }
  },
}

export const SeparatorTakesNoCharacter: Story = {
  render: () => <ComposedOTPField {...otpFieldControlArgs} separator />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Verification code',
    })
    await expect(within(group).getByRole('separator')).toBeVisible()
    const slots = slotsOf(canvasElement)
    await userEvent.click(slots[0] as HTMLInputElement)
    await userEvent.keyboard('4829')
    await expect(slots.map((slot) => slot.value)).toEqual([
      '4',
      '8',
      '2',
      '9',
      '',
      '',
    ])
    await waitFor(() => expect(slots[4]).toHaveFocus())
  },
}
