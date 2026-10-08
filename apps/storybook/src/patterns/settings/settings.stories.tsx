import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRow, SettingsSection } from '@tc96/parttens'
import { Input } from '@tc96/ui/input'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Switch } from '@tc96/ui/switch'
import { BellIcon, LanguagesIcon, TypeIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

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

const languageOptions: SettingOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt-BR' },
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

function PreferencesDemo() {
  const [displayNames, setDisplayNames] = useState('full-name')
  const [fontSize, setFontSize] = useState('default')
  const [underlineLinks, setUnderlineLinks] = useState(false)
  const [theme, setTheme] = useState('dark')

  return (
    <div className="flex flex-col gap-8">
      <SettingsSection title="General">
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
      <SettingsSection title="Interface and theme">
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
  args: {
    description: 'Adjusts the text size across the whole app',
    title: 'Font size',
  },
  component: SettingsRow,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A settings surface: `SettingsSection` frames `SettingsRow`s in a divided card, named by an optional `h2` title. Each row shows `title` and `description` on the left, an optional `startSlot` before them and the control in `endSlot`. The row knows nothing about the control, so a select, a switch or an input enters through the same slot, and the consumer owns its value and its accessible name.',
      },
    },
    layout: 'padded',
  },
  subcomponents: { SettingsSection },
  title: 'Patterns/Settings',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="settings-row"]'),
  )

const slotOf = (row: HTMLElement, name: 'end' | 'heading' | 'start') =>
  row.querySelector(`[data-slot="settings-row-${name}"]`) as HTMLElement

export const Preferences: Story = {
  render: () => <PreferencesDemo />,
}

export const PreferencesInteraction: Story = {
  ...Preferences,
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

const onFontSizeChange = fn()

export const WithSelect: Story = {
  render: (args) => (
    <SettingsSection title="Interface and theme">
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

export const WithSelectInteraction: Story = {
  ...WithSelect,
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

const onUnderlineLinksChange = fn()

export const WithSwitch: Story = {
  args: {
    description: 'Always underlines list titles',
    title: 'Underline links',
  },
  render: (args) => (
    <SettingsSection title="Interface and theme">
      <SettingsRow
        {...args}
        endSlot={
          <Switch
            aria-label="Underline links"
            onCheckedChange={onUnderlineLinksChange}
          />
        }
      />
    </SettingsSection>
  ),
}

export const WithSwitchInteraction: Story = {
  ...WithSwitch,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Underline links' })

    expect(toggle).not.toBeChecked()

    await userEvent.click(toggle)

    await waitFor(() => expect(toggle).toBeChecked())
    expect(onUnderlineLinksChange).toHaveBeenCalledTimes(1)
    expect(onUnderlineLinksChange.mock.calls[0]?.[0]).toBe(true)
  },
  tags: interaction,
}

const onWorkspaceNameCommit = fn()

export const WithInput: Story = {
  args: {
    description: 'Saved automatically when you leave the field',
    title: 'Workspace name',
  },
  render: (args) => (
    <SettingsSection title="Workspace">
      <SettingsRow
        {...args}
        endSlot={
          <Input
            aria-label="Workspace name"
            className="w-56"
            defaultValue="Acme Legal"
            onBlur={(event) => onWorkspaceNameCommit(event.currentTarget.value)}
          />
        }
      />
    </SettingsSection>
  ),
}

export const WithInputInteraction: Story = {
  ...WithInput,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Workspace name' })

    expect(input).toHaveValue('Acme Legal')

    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Partners')
    expect(onWorkspaceNameCommit).not.toHaveBeenCalled()

    await userEvent.tab()

    expect(onWorkspaceNameCommit).toHaveBeenCalledWith('Acme Partners')
  },
  tags: interaction,
}

export const WithStartSlot: Story = {
  render: (args) => (
    <SettingsSection title="Interface and theme">
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

export const WithStartSlotInteraction: Story = {
  ...WithStartSlot,
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

export const Untitled: Story = {
  args: {
    description: 'The address of your workspace; every page lives under it',
    title: 'URL',
  },
  render: (args) => (
    <SettingsSection>
      <SettingsRow
        {...args}
        endSlot={
          <span className="text-muted-foreground text-sm">/acme-legal</span>
        }
      />
    </SettingsSection>
  ),
}

export const UntitledInteraction: Story = {
  ...Untitled,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvas.queryByRole('region')).toBeNull()
    expect(canvas.queryByRole('heading')).toBeNull()
    expect(
      canvasElement.querySelector('[data-slot="settings-section-card"]'),
    ).not.toBeNull()
  },
  tags: interaction,
}
