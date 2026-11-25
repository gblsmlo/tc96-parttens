import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneInput } from '@tc96/ui/patterns/properties/display/phone-input/phone-input'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { PhoneInputCanvas } from './phone-input-canvas.tsx'
import { phoneInputControlArgs } from './phone-input-controls.ts'
import {
  ComposedPhoneInput,
  StatefulPhoneInput,
} from './phone-input-layouts.tsx'

const meta = {
  args: {
    ariaLabel: 'Telefone',
    onValueChange: fn(),
    value: null,
    labels: ptBRPropertyLabels.phoneInput,
  },
  component: PhoneInput,
  decorators: [PhoneInputCanvas],
  render: (args) => <StatefulPhoneInput {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/PhoneInput/Behavior',
} satisfies Meta<typeof PhoneInput>

export default meta

type Story = StoryObj<typeof meta>

const phoneField = (canvasElement: HTMLElement) =>
  within(canvasElement).getByLabelText<HTMLInputElement>('Telefone')

const countryTrigger = (canvasElement: HTMLElement, country: string) =>
  within(canvasElement).getByRole('combobox', { name: `País: ${country}` })

const groupOf = (field: HTMLElement) => {
  const group = field.closest<HTMLElement>('[data-slot="phone-input"]')
  if (!group) throw new Error('The field is outside a [data-slot=phone-input].')
  return group
}

const countryListClosed = () =>
  waitFor(() =>
    expect(
      screen.queryByRole('listbox', { name: 'Selecionar país' }),
    ).toBeNull(),
  )

export const SavedNumberInNationalFormat: Story = {
  args: { value: '+5511987654321' },
  play: async ({ args, canvasElement }) => {
    await expect(phoneField(canvasElement)).toHaveValue('(11) 98765-4321')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const TypingEmitsE164: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.type(phoneField(canvasElement), '11987654321')

    await expect(args.onValueChange).toHaveBeenLastCalledWith('+5511987654321')
    await expect(phoneField(canvasElement)).toHaveValue('(11) 98765-4321')
  },
}

export const CountryFromTheNumber: Story = {
  args: { value: '+351912345678' },
  play: async ({ canvasElement }) => {
    await expect(countryTrigger(canvasElement, 'Portugal')).toBeVisible()
    await expect(phoneField(canvasElement)).toHaveValue('912 345 678')
  },
}

export const DefaultCountryWithoutNumber: Story = {
  args: { defaultCountry: 'PT' },
  play: async ({ canvasElement }) => {
    await expect(countryTrigger(canvasElement, 'Portugal')).toBeVisible()
    await expect(phoneField(canvasElement)).toHaveValue('')
  },
}

export const CountryChangeKeepsDigits: Story = {
  args: { value: '+5511987654321' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(countryTrigger(canvasElement, 'Brasil'))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar país' }),
      'Portugal',
    )
    await userEvent.click(
      await screen.findByRole('option', { name: /^Portugal/ }),
    )
    await countryListClosed()

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('+35111987654321')
    await expect(countryTrigger(canvasElement, 'Portugal')).toBeVisible()
  },
}

export const SearchMatchesCallingCode: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(countryTrigger(canvasElement, 'Brasil'))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar país' }),
      '351',
    )

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
    await expect(
      screen.getByRole('option', { name: 'Portugal +351' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await countryListClosed()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ReadOnlyBlocksNumberAndCountry: Story = {
  args: { readOnly: true, value: '+5511987654321' },
  play: async ({ canvasElement }) => {
    await expect(countryTrigger(canvasElement, 'Brasil')).toBeDisabled()
    await expect(phoneField(canvasElement)).toHaveAttribute('readonly')
  },
}

export const DisabledBlocksNumberAndCountry: Story = {
  args: { disabled: true, value: '+5511987654321' },
  play: async ({ canvasElement }) => {
    await expect(countryTrigger(canvasElement, 'Brasil')).toBeDisabled()
    await expect(phoneField(canvasElement)).toBeDisabled()
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

    countryTrigger(canvasElement, 'Brasil').focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{Escape}')
    await countryListClosed()
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
    await expect(countryTrigger(canvasElement, 'Brasil')).not.toHaveAttribute(
      'aria-invalid',
    )
  },
}

export const DisabledDimsTheWholeGroup: Story = {
  render: () => <ComposedPhoneInput {...phoneInputControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const group = groupOf(phoneField(canvasElement))

    await expect(getComputedStyle(group).opacity).toBe('0.64')
  },
}

export const InvalidPaintsTheGroupBorder: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <ComposedPhoneInput {...phoneInputControlArgs} />
      <ComposedPhoneInput
        {...phoneInputControlArgs}
        ariaLabel="Telefone inválido"
        invalid
        value="+55119876"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const valid = groupOf(phoneField(canvasElement))
    const invalid = groupOf(
      within(canvasElement).getByLabelText('Telefone inválido'),
    )

    await expect(getComputedStyle(invalid).borderTopColor).not.toBe(
      getComputedStyle(valid).borderTopColor,
    )
  },
}
