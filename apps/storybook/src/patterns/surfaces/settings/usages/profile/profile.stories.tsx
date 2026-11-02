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
import { CameraIcon } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

interface ProfileField {
  description?: string
  label: string
  name: 'fullName' | 'jobTitle' | 'username'
  value: string
}

const profileFields: ProfileField[] = [
  { label: 'Full name', name: 'fullName', value: 'Maya Santos' },
  {
    description: 'Used in mentions and in your profile URL',
    label: 'Username',
    name: 'username',
    value: 'maya',
  },
  { label: 'Job title', name: 'jobTitle', value: 'Product designer' },
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

interface EmailFieldProps {
  defaultEmail: string
  onSubmit: (email: string) => void
}

function EmailField({ defaultEmail, onSubmit }: Readonly<EmailFieldProps>) {
  const [savedEmail, setSavedEmail] = useState(defaultEmail)
  const [email, setEmail] = useState(defaultEmail)
  const changed = email.trim() !== savedEmail

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!changed) return
    const next = email.trim()
    onSubmit(next)
    setSavedEmail(next)
    setEmail(next)
  }

  return (
    <form className="flex items-center gap-3" onSubmit={handleSubmit}>
      <Input
        aria-label="Email"
        className="w-56"
        onChange={(event) => setEmail(event.currentTarget.value)}
        type="email"
        value={email}
      />
      <Button disabled={!changed} size="sm" type="submit" variant="outline">
        Save
      </Button>
    </form>
  )
}

interface ProfileSettingsProps {
  onDeleteAccount: () => void
  onEmailSubmit: (email: string) => void
  onFieldCommit: (name: ProfileField['name'], value: string) => void
  onSignOutEverywhere: () => void
  onUploadAvatar: () => void
}

function ProfileSettings({
  onDeleteAccount,
  onEmailSubmit,
  onFieldCommit,
  onSignOutEverywhere,
  onUploadAvatar,
}: Readonly<ProfileSettingsProps>) {
  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Profile</SettingsSectionTitle>
            <SettingsSectionDescription>
              How you appear to your teammates in every workspace.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="PNG or JPG, at least 256 × 256 px"
          endSlot={
            <AvatarUploadTrigger
              initials="MS"
              label="Upload avatar"
              onClick={onUploadAvatar}
            />
          }
          title="Avatar"
        />
        {profileFields.map((field) => (
          <SettingsRow
            description={field.description}
            endSlot={
              <Input
                aria-label={field.label}
                className="w-56"
                defaultValue={field.value}
                onBlur={(event) =>
                  onFieldCommit(field.name, event.currentTarget.value)
                }
              />
            }
            key={field.name}
            title={field.label}
          />
        ))}
      </SettingsSection>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Account</SettingsSectionTitle>
            <SettingsSectionDescription>
              Sign-in details and sessions for your account.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="Used to sign in and to receive notifications"
          endSlot={
            <EmailField defaultEmail="maya@acme.io" onSubmit={onEmailSubmit} />
          }
          title="Email"
        />
        <SettingsRow
          description="Signed in on 3 devices"
          endSlot={
            <Button onClick={onSignOutEverywhere} size="sm" variant="outline">
              Sign out everywhere
            </Button>
          }
          title="Sessions"
        />
        <SettingsRow
          description="Removes your account and your access to every workspace"
          endSlot={
            <Button onClick={onDeleteAccount} size="sm" variant="destructive">
              Delete account
            </Button>
          }
          title="Delete account"
        />
      </SettingsSection>
    </div>
  )
}

const meta = {
  args: {
    onDeleteAccount: fn(),
    onEmailSubmit: fn(),
    onFieldCommit: fn(),
    onSignOutEverywhere: fn(),
    onUploadAvatar: fn(),
  },
  component: ProfileSettings,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages/Profile/Profile',
} satisfies Meta<typeof ProfileSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Profile: Story = { name: 'Profile' }

export const Interaction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('region', { name: 'Profile' })).toBeVisible()
    expect(canvas.getByRole('region', { name: 'Account' })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Upload avatar' }))
    expect(args.onUploadAvatar).toHaveBeenCalledOnce()

    const fullName = canvas.getByRole('textbox', { name: 'Full name' })
    await userEvent.clear(fullName)
    await userEvent.type(fullName, 'Maya S. Santos')
    expect(args.onFieldCommit).not.toHaveBeenCalled()
    await userEvent.tab()
    expect(args.onFieldCommit).toHaveBeenCalledWith(
      'fullName',
      'Maya S. Santos',
    )

    const email = canvas.getByRole('textbox', { name: 'Email' })
    const saveEmail = canvas.getByRole('button', { name: 'Save' })
    expect(saveEmail).toBeDisabled()
    await userEvent.type(email, '{Enter}')
    expect(args.onEmailSubmit).not.toHaveBeenCalled()
    await userEvent.clear(email)
    await userEvent.type(email, 'maya@acme.com')
    expect(saveEmail).toBeEnabled()
    await userEvent.click(saveEmail)
    expect(args.onEmailSubmit).toHaveBeenCalledOnce()
    expect(args.onEmailSubmit).toHaveBeenCalledWith('maya@acme.com')
    expect(saveEmail).toBeDisabled()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Sign out everywhere' }),
    )
    expect(args.onSignOutEverywhere).toHaveBeenCalledOnce()
    expect(canvas.getByRole('button', { name: 'Delete account' })).toBeVisible()
  },
  tags: ['!dev', '!autodocs'],
}
