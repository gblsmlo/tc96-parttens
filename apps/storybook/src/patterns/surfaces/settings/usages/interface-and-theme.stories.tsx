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
import { expect } from 'storybook/test'

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
  title: 'Patterns/Surfaces/Settings/Usages/Interface and theme',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="settings-row"]'),
  )

const slotOf = (row: HTMLElement, name: 'heading' | 'start') =>
  row.querySelector(`[data-slot="settings-row-${name}"]`) as HTMLElement

export const Default: Story = {
  args: {
    description: 'Adjusts the text size across the whole app',
    title: 'Font size',
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

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    for (const row of rowsOf(canvasElement)) {
      const start = slotOf(row, 'start')
      const icon = (
        start.querySelector('svg') as SVGElement
      ).getBoundingClientRect()
      const heading = slotOf(row, 'heading').getBoundingClientRect()

      expect(start.nextElementSibling).toBe(slotOf(row, 'heading'))
      expect(icon.width).toBe(16)
      expect(icon.right).toBeLessThanOrEqual(heading.left)
    }
  },
  tags: interaction,
}
