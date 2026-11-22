import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { PaletteIcon, SunMoonIcon } from 'lucide-react'
import { Fragment } from 'react'
import { useGlobals } from 'storybook/preview-api'
import { expect, fn, within } from 'storybook/test'
import {
  type ThemePreset,
  themePresets,
} from '../../../../../../../example/packages/ui/src/themes/presets.ts'

type ThemeMode = 'system' | 'light' | 'dark'

const modeOptions: { label: string; value: ThemeMode }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const presetItems = themePresets.map(({ title, value }) => ({
  label: title,
  value,
}))

const presetGroups: { label: string; source: ThemePreset['source'] }[] = [
  { label: 'Base colors', source: 'coss' },
  { label: 'tweakcn', source: 'tweakcn' },
]

const presetsFrom = (source: ThemePreset['source']) =>
  themePresets.filter((preset) => preset.source === source)

const titleOf = (value: string) =>
  themePresets.find((preset) => preset.value === value)?.title ?? value

function ThemeSwatch({ preset }: Readonly<{ preset: string }>) {
  return (
    <span
      aria-hidden="true"
      className="flex h-4 w-7 shrink-0 overflow-hidden rounded-full border border-foreground/16 bg-background"
      data-slot="theme-swatch"
      data-theme-preset={preset}
    >
      <span className="flex-1" />
      <span className="flex-1 bg-accent" />
      <span className="flex-1 bg-primary" data-slot="theme-swatch-primary" />
    </span>
  )
}

function ThemeOption({ preset }: Readonly<{ preset: ThemePreset }>) {
  return (
    <SelectItem value={preset.value}>
      <span className="flex items-center gap-2">
        <ThemeSwatch preset={preset.value} />
        {preset.title}
      </span>
    </SelectItem>
  )
}

interface ThemePresetSelectProps {
  onValueChange?: (value: string) => void
  value: string
}

function ThemePresetSelect({
  onValueChange,
  value,
}: Readonly<ThemePresetSelectProps>) {
  return (
    <Select
      items={presetItems}
      onValueChange={(next) => {
        if (next) onValueChange?.(next)
      }}
      value={value}
    >
      <SelectTrigger aria-label="Theme" className="w-52">
        <SelectValue>
          {(current: string) => (
            <span className="flex min-w-0 items-center gap-2">
              <ThemeSwatch preset={current} />
              <span className="truncate">{titleOf(current)}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {presetsFrom('tc96').map((preset) => (
          <ThemeOption key={preset.value} preset={preset} />
        ))}
        {presetGroups.map(({ label, source }) => (
          <Fragment key={source}>
            <SelectSeparator />
            <SelectGroup>
              <SelectGroupLabel>{label}</SelectGroupLabel>
              {presetsFrom(source).map((preset) => (
                <ThemeOption key={preset.value} preset={preset} />
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectPopup>
    </Select>
  )
}

interface ThemeSettingsProps {
  colorTheme: string
  mode: ThemeMode
  onColorThemeChange?: (value: string) => void
  onModeChange?: (value: ThemeMode) => void
}

function ThemeSettings({
  colorTheme,
  mode,
  onColorThemeChange,
  onModeChange,
}: Readonly<ThemeSettingsProps>) {
  return (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Appearance</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        description="Light, dark or the setting of your system"
        endSlot={
          <Select
            items={modeOptions}
            onValueChange={(next) => {
              if (next) onModeChange?.(next)
            }}
            value={mode}
          >
            <SelectTrigger aria-label="Mode" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {modeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        }
        startSlot={<SunMoonIcon aria-hidden="true" />}
        title="Mode"
      />
      <SettingsRow
        description="Colors, radius and fonts of the interface"
        endSlot={
          <ThemePresetSelect
            onValueChange={onColorThemeChange}
            value={colorTheme}
          />
        }
        startSlot={<PaletteIcon aria-hidden="true" />}
        title="Theme"
      />
    </SettingsSection>
  )
}

const withStorybookTheme: Decorator<ThemeSettingsProps> = (Story, { args }) => {
  const [globals, updateGlobals] = useGlobals()

  return (
    <div className="w-full max-w-2xl">
      <Story
        args={{
          ...args,
          colorTheme: globals.themePreset ?? 'default',
          mode: globals.theme ?? 'dark',
          onColorThemeChange: (themePreset) => {
            args.onColorThemeChange?.(themePreset)
            updateGlobals({ themePreset })
          },
          onModeChange: (theme) => {
            args.onModeChange?.(theme)
            updateGlobals({ theme })
          },
        }}
      />
    </div>
  )
}

const meta = {
  args: {
    colorTheme: 'default',
    mode: 'dark',
    onColorThemeChange: fn(),
    onModeChange: fn(),
  },
  argTypes: {
    colorTheme: { control: false },
    mode: { control: false },
  },
  component: ThemeSettings,
  decorators: [withStorybookTheme],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof ThemeSettings>

export default meta

type Story = StoryObj<typeof meta>

export const ThemePicker: Story = {
  name: 'Theme picker',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('combobox', { name: 'Theme' })).toBeVisible()
  },
}
