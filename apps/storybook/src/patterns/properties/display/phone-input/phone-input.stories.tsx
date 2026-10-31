import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneInput } from '@tc96/parttens/properties/display/phone-input/phone-input'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: { ariaLabel: 'Telefone', onValueChange: fn() },
  component: PhoneInput,
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone Input',
} satisfies Meta<typeof PhoneInput>

export default meta

type Story = StoryObj<typeof meta>

const phoneField = (canvasElement: HTMLElement) =>
  within(canvasElement).getByLabelText<HTMLInputElement>('Telefone')

export const SavedNumberInNationalFormat: Story = {
  args: { value: '+5511987654321' },
  play: async ({ canvasElement }) => {
    await expect(phoneField(canvasElement)).toHaveValue('(11) 98765-4321')
  },
}

export const CountryFromTheNumber: Story = {
  args: { value: '+351912345678' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'País: Portugal' }),
    ).toBeInTheDocument()
    await expect(phoneField(canvasElement)).toHaveValue('912 345 678')
  },
}

export const DefaultCountryWithoutNumber: Story = {
  args: { defaultCountry: 'PT', value: null },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'País: Portugal' }),
    ).toBeInTheDocument()
  },
}

export const ReadOnlyBlocksNumberAndCountry: Story = {
  args: { readOnly: true, value: '+5511987654321' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'País: Brasil' }),
    ).toBeDisabled()
    await expect(phoneField(canvasElement)).toHaveAttribute('readonly')
  },
}

export const ForwardsKeysFromNumberOnly: Story = {
  args: { onKeyDown: fn(), value: '+5511987654321' },
  play: async ({ args, canvasElement }) => {
    const keys = () =>
      (args.onKeyDown as ReturnType<typeof fn>).mock.calls.map(
        ([event]) => (event as KeyboardEvent).key,
      )

    phoneField(canvasElement).focus()
    await userEvent.keyboard('{Enter}')
    await expect(keys()).toEqual(['Enter'])

    within(canvasElement)
      .getByRole('combobox', { name: 'País: Brasil' })
      .focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{Escape}')
    await expect(keys()).toEqual(['Enter'])
  },
}

export const InvalidMarksOnlyTheNumber: Story = {
  args: { invalid: true, value: '+55119876' },
  play: async ({ canvasElement }) => {
    await expect(phoneField(canvasElement)).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'País: Brasil' }),
    ).not.toHaveAttribute('aria-invalid')
  },
}
