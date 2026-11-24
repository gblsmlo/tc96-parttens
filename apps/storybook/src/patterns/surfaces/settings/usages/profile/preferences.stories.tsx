import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Switch } from '@tc96/ui/switch'
import { useState } from 'react'
import { expect, within } from 'storybook/test'

interface SettingOption {
  label: string
  value: string
}

const displayNameOptions: SettingOption[] = [
  { label: 'Full name', value: 'full-name' },
  { label: 'Username', value: 'username' },
]

const fontSizeOptions: SettingOption[] = [
  { label: 'Small', value: 'small' },
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
]

const themeOptions: SettingOption[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

interface SettingSelectProps {
  ariaLabel: string
  items: SettingOption[]
  onValueChange?: (value: string) => void
  value: string
}

function SettingSelect({
  ariaLabel,
  items,
  onValueChange,
  value,
}: Readonly<SettingSelectProps>) {
  return (
    <Select
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

function PreferencesDemo() {
  const [displayNames, setDisplayNames] = useState('full-name')
  const [fontSize, setFontSize] = useState('default')
  const [underlineLinks, setUnderlineLinks] = useState(false)
  const [theme, setTheme] = useState('dark')

  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>General</SettingsSectionTitle>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="How people's names appear across the interface"
          endSlot={
            <SettingSelect
              ariaLabel="Display names"
              items={displayNameOptions}
              onValueChange={setDisplayNames}
              value={displayNames}
            />
          }
          title="Display names"
        />
      </SettingsSection>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Interface and theme</SettingsSectionTitle>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="Adjusts the text size across the whole app"
          endSlot={
            <SettingSelect
              ariaLabel="Font size"
              items={fontSizeOptions}
              onValueChange={setFontSize}
              value={fontSize}
            />
          }
          title="Font size"
        />
        <SettingsRow
          description="Always underlines list titles"
          endSlot={
            <Switch
              aria-label="Underline links"
              checked={underlineLinks}
              onCheckedChange={setUnderlineLinks}
            />
          }
          title="Underline links"
        />
        <SettingsRow
          description="Choose the interface color scheme"
          endSlot={
            <SettingSelect
              ariaLabel="Interface theme"
              items={themeOptions}
              onValueChange={setTheme}
              value={theme}
            />
          }
          title="Interface theme"
        />
      </SettingsSection>
    </div>
  )
}

const meta = {
  component: SettingsSection,
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
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Preferences: Story = {
  name: 'Preferences',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'General' })).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Interface and theme' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Underline links' }),
    ).toBeVisible()
  },
  render: () => <PreferencesDemo />,
}
