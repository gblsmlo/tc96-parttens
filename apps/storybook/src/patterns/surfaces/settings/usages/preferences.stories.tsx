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
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
  title: 'Patterns/Surfaces/Settings/Usages/Preferences',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="settings-row"]'),
  )

const slotOf = (row: HTMLElement, name: 'end' | 'heading') =>
  row.querySelector(`[data-slot="settings-row-${name}"]`) as HTMLElement

export const Default: Story = {
  render: () => <PreferencesDemo />,
}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('region', { name: 'General' })).toBeVisible()
    expect(
      canvas.getByRole('region', { name: 'Interface and theme' }),
    ).toBeVisible()

    const rows = rowsOf(canvasElement)
    expect(rows).toHaveLength(4)
    for (const row of rows) {
      const card = row.parentElement as HTMLElement
      const cardStyle = getComputedStyle(card)
      const contentRight =
        card.getBoundingClientRect().right -
        Number.parseFloat(cardStyle.borderRightWidth) -
        Number.parseFloat(cardStyle.paddingRight)
      const end = slotOf(row, 'end').getBoundingClientRect()

      expect(Math.abs(end.right - contentRight)).toBeLessThan(1)
      expect(end.left).toBeGreaterThan(
        slotOf(row, 'heading').getBoundingClientRect().left,
      )
    }

    const underline = canvas.getByRole('switch', { name: 'Underline links' })
    expect(underline).not.toBeChecked()
    await userEvent.click(underline)
    await waitFor(() => expect(underline).toBeChecked())
  },
  tags: interaction,
}
