import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@tc96/ui/input-group'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { CameraIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

interface TimeZoneOption {
  label: string
  value: string
}

const timeZones: TimeZoneOption[] = [
  { label: 'São Paulo (UTC−03:00)', value: 'America/Sao_Paulo' },
  { label: 'New York (UTC−05:00)', value: 'America/New_York' },
  { label: 'London (UTC+00:00)', value: 'Europe/London' },
  { label: 'Berlin (UTC+01:00)', value: 'Europe/Berlin' },
]

function AvatarUploadTrigger({
  initials,
  label,
  onClick,
}: Readonly<{ initials: string; label: string; onClick: () => void }>) {
  return (
    <Avatar
      aria-label={label}
      className="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      onClick={onClick}
      render={<button type="button" />}
    >
      <AvatarFallback>{initials}</AvatarFallback>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-foreground/64 text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <CameraIcon className="size-4" />
      </span>
    </Avatar>
  )
}

interface GeneralSettingsProps {
  onDeleteWorkspace: () => void
  onNameCommit: (value: string) => void
  onSlugCommit: (value: string) => void
  onTimeZoneChange: (value: string) => void
  onUploadLogo: () => void
}

function GeneralSettings({
  onDeleteWorkspace,
  onNameCommit,
  onSlugCommit,
  onTimeZoneChange,
  onUploadLogo,
}: Readonly<GeneralSettingsProps>) {
  const [timeZone, setTimeZone] = useState('America/Sao_Paulo')

  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Workspace</SettingsSectionTitle>
            <SettingsSectionDescription>
              Details every member of Acme sees.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="Shown in the sidebar and in invitation emails"
          endSlot={
            <AvatarUploadTrigger
              initials="AC"
              label="Upload logo"
              onClick={onUploadLogo}
            />
          }
          title="Logo"
        />
        <SettingsRow
          endSlot={
            <Input
              aria-label="Workspace name"
              className="w-64"
              defaultValue="Acme"
              onBlur={(event) => onNameCommit(event.currentTarget.value)}
            />
          }
          title="Workspace name"
        />
        <SettingsRow
          description="Changing it breaks links shared before"
          endSlot={
            <InputGroup className="w-64">
              <InputGroupAddon>
                <InputGroupText>app.example.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-label="Workspace URL"
                defaultValue="acme"
                onBlur={(event) => onSlugCommit(event.currentTarget.value)}
              />
            </InputGroup>
          }
          title="Workspace URL"
        />
        <SettingsRow
          description="Used for due dates, reports and scheduled emails"
          endSlot={
            <Select
              items={timeZones}
              onValueChange={(next) => {
                if (!next) return
                setTimeZone(next)
                onTimeZoneChange(next)
              }}
              value={timeZone}
            >
              <SelectTrigger aria-label="Time zone" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {timeZones.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          }
          title="Time zone"
        />
      </SettingsSection>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Danger zone</SettingsSectionTitle>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="Deletes every record and removes all members' access"
          endSlot={
            <Button onClick={onDeleteWorkspace} size="sm" variant="destructive">
              Delete workspace
            </Button>
          }
          title="Delete workspace"
        />
      </SettingsSection>
    </div>
  )
}

const meta = {
  args: {
    onDeleteWorkspace: fn(),
    onNameCommit: fn(),
    onSlugCommit: fn(),
    onTimeZoneChange: fn(),
    onUploadLogo: fn(),
  },
  component: GeneralSettings,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages/Workspace/General',
} satisfies Meta<typeof GeneralSettings>

export default meta

type Story = StoryObj<typeof meta>

export const General: Story = { name: 'General' }

export const Interaction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('region', { name: 'Workspace' })).toBeVisible()
    expect(canvas.getByRole('region', { name: 'Danger zone' })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Upload logo' }))
    expect(args.onUploadLogo).toHaveBeenCalledOnce()

    const name = canvas.getByRole('textbox', { name: 'Workspace name' })
    await userEvent.clear(name)
    await userEvent.type(name, 'Acme Inc')
    await userEvent.tab()
    expect(args.onNameCommit).toHaveBeenCalledWith('Acme Inc')

    await userEvent.click(canvas.getByRole('combobox', { name: 'Time zone' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'London (UTC+00:00)' }),
    )
    await waitFor(() =>
      expect(args.onTimeZoneChange).toHaveBeenCalledWith('Europe/London'),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('combobox', { name: 'Time zone' }),
      ).toHaveTextContent('London (UTC+00:00)'),
    )
  },
  tags: ['!dev', '!autodocs'],
}
