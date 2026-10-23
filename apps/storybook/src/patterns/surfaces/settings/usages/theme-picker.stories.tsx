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
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  type ThemePreset,
  themePresets,
} from '../../../../../../example/packages/ui/src/themes/presets.ts'

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
  title: 'Patterns/Surfaces/Settings/Usages/Theme picker',
} satisfies Meta<typeof ThemeSettings>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const swatchOf = (element: Element) =>
  element.querySelector('[data-slot="theme-swatch"]') as HTMLElement

const primaryOf = (swatch: HTMLElement) =>
  getComputedStyle(
    swatch.querySelector('[data-slot="theme-swatch-primary"]') as HTMLElement,
  ).backgroundColor

export const Default: Story = {}

export const Interaction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Theme' })
    expect(swatchOf(trigger).dataset.themePreset).toBe('default')

    await userEvent.click(trigger)
    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(themePresets.length)
    for (const [index, option] of options.entries()) {
      const swatch = swatchOf(option)
      expect(swatch).toHaveAttribute('aria-hidden', 'true')
      expect(swatch.dataset.themePreset).toBe(themePresets[index]?.value)
    }

    const zinc = screen.getByRole('option', { name: 'Zinc' })
    const claude = screen.getByRole('option', { name: 'Claude' })
    expect(primaryOf(swatchOf(zinc))).not.toBe(primaryOf(swatchOf(claude)))

    await userEvent.click(zinc)
    await waitFor(() =>
      expect(args.onColorThemeChange).toHaveBeenCalledWith('zinc'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
  tags: interaction,
}
