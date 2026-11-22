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
import { Switch } from '@tc96/ui/switch'
import { BellIcon, LanguagesIcon, TypeIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

interface SettingOption {
  label: string
  value: string
}

const fontSizeOptions: SettingOption[] = [
  { label: 'Small', value: 'small' },
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
]

const languageOptions: SettingOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt-BR' },
]

interface SettingSelectProps {
  ariaLabel: string
  defaultValue?: string
  items: SettingOption[]
}

function SettingSelect({
  ariaLabel,
  defaultValue,
  items,
}: Readonly<SettingSelectProps>) {
  return (
    <Select defaultValue={defaultValue} items={items}>
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

const meta = {
  component: SettingsRow,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

export const InterfaceAndTheme: Story = {
  name: 'Interface and theme',
  args: {
    description: 'Adjusts the text size across the whole app',
    title: 'Font size',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Interface and theme' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: /^Font size/ }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Email notifications' }),
    ).toBeChecked()
  },
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
          />
        }
        startSlot={<TypeIcon aria-hidden="true" />}
      />
      <SettingsRow
        description="The language of menus and messages"
        endSlot={
          <SettingSelect
            ariaLabel="Language"
            defaultValue="en"
            items={languageOptions}
          />
        }
        startSlot={<LanguagesIcon aria-hidden="true" />}
        title="Language"
      />
      <SettingsRow
        description="Sends a summary of the day's activity"
        endSlot={<Switch aria-label="Email notifications" defaultChecked />}
        startSlot={<BellIcon aria-hidden="true" />}
        title="Email notifications"
      />
    </SettingsSection>
  ),
}
