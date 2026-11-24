import { CircleHalfIcon, PaletteIcon } from '@phosphor-icons/react'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
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
import { cn } from '@tc96/utils'
import { Fragment } from 'react'
import { settingsLoadState } from '../shared/settings-load-state'
import { defaultSettings4Labels } from './labels'
import { Settings4Skeleton } from './settings-4-skeleton'
import type { Settings4Option, Settings4Props } from './types'

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

function ThemeOption({ option }: Readonly<{ option: Settings4Option }>) {
  return (
    <SelectItem value={option.value}>
      <span className="flex items-center gap-2">
        <ThemeSwatch preset={option.value} />
        {option.label}
      </span>
    </SelectItem>
  )
}

export function Settings4({
  error,
  onRetry,
  pending,
  className,
  colorTheme,
  labels: labelsProp,
  mode,
  modeOptions,
  onColorThemeChange,
  onModeChange,
  themeGroups,
}: Readonly<Settings4Props>) {
  const labels = { ...defaultSettings4Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings4Skeleton />,
  })
  const themeOptions = themeGroups.flatMap((group) => group.options)
  const titleOf = (value: string) =>
    themeOptions.find((option) => option.value === value)?.label ?? value

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      {loadState ?? (
        <>
          <SettingsRow
            description={labels.modeDescription}
            endSlot={
              <Select
                items={modeOptions}
                onValueChange={(next) => {
                  if (next) onModeChange?.(next)
                }}
                value={mode}
              >
                <SelectTrigger aria-label={labels.mode} className="w-52">
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
            startSlot={<CircleHalfIcon aria-hidden="true" />}
            title={labels.mode}
          />
          <SettingsRow
            description={labels.themeDescription}
            endSlot={
              <Select
                items={themeOptions}
                onValueChange={(next) => {
                  if (next) onColorThemeChange?.(next)
                }}
                value={colorTheme}
              >
                <SelectTrigger aria-label={labels.theme} className="w-52">
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
                  {themeGroups.map((group, index) => (
                    <Fragment key={group.id}>
                      {index > 0 ? <SelectSeparator /> : null}
                      {group.label ? (
                        <SelectGroup>
                          <SelectGroupLabel>{group.label}</SelectGroupLabel>
                          {group.options.map((option) => (
                            <ThemeOption key={option.value} option={option} />
                          ))}
                        </SelectGroup>
                      ) : (
                        group.options.map((option) => (
                          <ThemeOption key={option.value} option={option} />
                        ))
                      )}
                    </Fragment>
                  ))}
                </SelectPopup>
              </Select>
            }
            startSlot={<PaletteIcon aria-hidden="true" />}
            title={labels.theme}
          />
        </>
      )}
    </SettingsSection>
  )
}
