import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

interface SettingOption {
  label: string
  value: string
}

const fontSizeOptions: SettingOption[] = [
  { label: 'Small', value: 'small' },
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
]

interface SettingSelectProps {
  ariaLabel: string
  defaultValue?: string
  items: SettingOption[]
  onValueChange?: (value: string) => void
  value?: string
}

function SettingSelect({
  ariaLabel,
  defaultValue,
  items,
  onValueChange,
  value,
}: Readonly<SettingSelectProps>) {
  return (
    <Select
      defaultValue={defaultValue}
      items={items}
      onValueChange={(next) => {
        if (next) onValueChange?.(next)
      }}
      value={value}
    >
      <SelectTrigger aria-label={ariaLabel} className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

const onFontSizeChange = fn()

const meta = {
  args: {
    description: 'Adjusts the text size across the whole app',
    title: 'Font size',
  },
  component: SettingsRow,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  title: 'Patterns/Surfaces/Settings/Select',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: (args) => (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Interface and theme</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        {...args}
        endSlot={
          <SettingSelect
            ariaLabel="Font size"
            defaultValue="default"
            items={fontSizeOptions}
            onValueChange={onFontSizeChange}
          />
        }
      />
    </SettingsSection>
  ),
}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: /^Font size/ })
    expect(trigger).toHaveTextContent('Default')
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Large' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Large'))
    expect(onFontSizeChange).toHaveBeenCalledWith('large')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
  tags: interaction,
}
