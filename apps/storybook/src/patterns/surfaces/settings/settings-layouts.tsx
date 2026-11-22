import {
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Switch } from '@tc96/ui/switch'
import { BellIcon, EllipsisIcon } from 'lucide-react'
import type {
  SettingsControlName,
  SettingsControls,
} from './settings-controls.ts'

interface SettingOption {
  label: string
  value: string
}

export const fontSizeOptions: SettingOption[] = [
  { label: 'Small', value: 'small' },
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
]

interface SettingSelectProps {
  ariaLabel: string
  defaultValue?: string
  items: SettingOption[]
  onValueChange?: (value: string) => void
}

export const SettingSelect = ({
  ariaLabel,
  defaultValue,
  items,
  onValueChange,
}: Readonly<SettingSelectProps>) => (
  <Select
    defaultValue={defaultValue}
    items={items}
    onValueChange={(next) => {
      if (next) onValueChange?.(next)
    }}
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

interface RowActionsProps {
  name: string
}

export const RowActions = ({ name }: Readonly<RowActionsProps>) => (
  <Menu>
    <MenuTrigger
      aria-label={`Actions for ${name}`}
      render={<Button size="icon-xs" variant="ghost" />}
    >
      <EllipsisIcon aria-hidden="true" />
    </MenuTrigger>
    <MenuPopup align="end">
      <MenuItem>Edit</MenuItem>
      <MenuItem variant="destructive">Remove</MenuItem>
    </MenuPopup>
  </Menu>
)

interface RowControlProps {
  control: SettingsControlName
  name: string
}

const RowControl = ({ control, name }: Readonly<RowControlProps>) => {
  if (control === 'text') {
    return <span className="text-muted-foreground text-sm">Full name</span>
  }
  if (control === 'switch') return <Switch aria-label={name} />
  if (control === 'select') {
    return (
      <SettingSelect
        ariaLabel={name}
        defaultValue="default"
        items={fontSizeOptions}
      />
    )
  }
  if (control === 'input') {
    return (
      <Input aria-label={name} className="w-56" defaultValue="Acme Legal" />
    )
  }
  if (control === 'menu') return <RowActions name={name} />
  return null
}

export const ComposedSettings = ({
  action,
  control,
  description,
  group,
  groupActions,
  groupOpen,
  icon,
  rowDescription,
  rowTitle,
  title,
}: Readonly<SettingsControls>) => (
  <SettingsSection
    header={
      title ? (
        <SettingsSectionHeader
          actions={action ? <Button size="sm">New rule</Button> : undefined}
        >
          <SettingsSectionTitle>{title}</SettingsSectionTitle>
          {description ? (
            <SettingsSectionDescription>
              {description}
            </SettingsSectionDescription>
          ) : null}
        </SettingsSectionHeader>
      ) : undefined
    }
  >
    <SettingsRow
      description={rowDescription || undefined}
      endSlot={
        control === 'none' ? undefined : (
          <RowControl control={control} name={rowTitle || 'Setting'} />
        )
      }
      startSlot={icon ? <BellIcon aria-hidden="true" /> : undefined}
      title={rowTitle}
    />
    <SettingsRow
      description="The language of menus and messages"
      endSlot={<span className="text-muted-foreground text-sm">English</span>}
      title="Language"
    />
    {group ? (
      <div>
        <SettingsCollapsed
          actions={
            groupActions ? (
              <Button size="sm" variant="ghost">
                Rename
              </Button>
            ) : undefined
          }
          defaultOpen={groupOpen}
          key={String(groupOpen)}
          title="Advanced"
        >
          <SettingsRow
            description="Sends the summary on Mondays"
            endSlot={<Switch aria-label="Weekly digest" />}
            title="Weekly digest"
          />
          <SettingsRow
            description="Skips everything that does not mention you"
            endSlot={<Switch aria-label="Mentions only" />}
            title="Mentions only"
          />
        </SettingsCollapsed>
      </div>
    ) : null}
  </SettingsSection>
)
