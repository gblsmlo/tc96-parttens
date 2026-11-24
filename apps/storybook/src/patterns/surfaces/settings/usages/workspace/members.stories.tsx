import { DotsThreeIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
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
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
import { expect, fn, within } from 'storybook/test'

type Role = 'admin' | 'guest' | 'member'

interface Member {
  email: string
  initials: string
  name: string
  role: Role | 'owner'
}

interface Invitation {
  email: string
  role: Role
  sent: string
}

const roles: { label: string; value: Role }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Guest', value: 'guest' },
]

const members: Member[] = [
  {
    email: 'maya@acme.io',
    initials: 'MS',
    name: 'Maya Santos',
    role: 'owner',
  },
  { email: 'leo@acme.io', initials: 'LP', name: 'Leo Park', role: 'admin' },
  { email: 'ana@acme.io', initials: 'AC', name: 'Ana Costa', role: 'member' },
  {
    email: 'sam@partner.co',
    initials: 'SR',
    name: 'Sam Reed',
    role: 'guest',
  },
]

const invitations: Invitation[] = [
  { email: 'noah@acme.io', role: 'member', sent: '2 days ago' },
  { email: 'iris@acme.io', role: 'admin', sent: '5 days ago' },
]

const roleLabel = (role: Role) =>
  roles.find((option) => option.value === role)?.label ?? role

function ActionsMenu({ items, label }: { items: string[]; label: string }) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-xs" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {items.map((item, index) => (
          <MenuItem
            key={item}
            variant={index === items.length - 1 ? 'destructive' : undefined}
          >
            {item}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

interface MemberRowProps {
  member: Member
  onRoleChange: (email: string, role: Role) => void
}

function MemberRow({ member, onRoleChange }: Readonly<MemberRowProps>) {
  const [role, setRole] = useState(member.role)

  return (
    <SettingsRow
      description={member.email}
      endSlot={
        role === 'owner' ? (
          <Text foreground="muted" render={<span>Owner</span>} size="sm" />
        ) : (
          <div className="flex items-center gap-3">
            <Select
              items={roles}
              onValueChange={(next) => {
                if (!next) return
                setRole(next)
                onRoleChange(member.email, next)
              }}
              value={role}
            >
              <SelectTrigger
                aria-label={`Role of ${member.name}`}
                className="w-32"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {roles.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <ActionsMenu
              items={['Remove from workspace']}
              label={`Actions for ${member.name}`}
            />
          </div>
        )
      }
      startSlot={
        <Avatar>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      }
      title={member.name}
    />
  )
}

interface MembersSettingsProps {
  onInvite: () => void
  onRoleChange: (email: string, role: Role) => void
}

function MembersSettings({
  onInvite,
  onRoleChange,
}: Readonly<MembersSettingsProps>) {
  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              <Button size="sm" onClick={onInvite}>
                Invite members
              </Button>
            }
          >
            <SettingsSectionTitle>Members</SettingsSectionTitle>
            <SettingsSectionDescription>
              {members.length} of 10 seats used on the Team plan.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        {members.map((member) => (
          <MemberRow
            key={member.email}
            member={member}
            onRoleChange={onRoleChange}
          />
        ))}
      </SettingsSection>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Pending invitations</SettingsSectionTitle>
          </SettingsSectionHeader>
        }
      >
        {invitations.map((invitation) => (
          <SettingsRow
            description={`${roleLabel(invitation.role)} · Sent ${invitation.sent}`}
            endSlot={
              <div className="flex items-center gap-3">
                <Badge variant="outline">Pending</Badge>
                <ActionsMenu
                  items={['Resend invitation', 'Revoke invitation']}
                  label={`Actions for ${invitation.email}`}
                />
              </div>
            }
            key={invitation.email}
            title={invitation.email}
          />
        ))}
      </SettingsSection>
    </div>
  )
}

const meta = {
  args: {
    onInvite: fn(),
    onRoleChange: fn(),
  },
  component: MembersSettings,
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
} satisfies Meta<typeof MembersSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Members: Story = {
  name: 'Members',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Members' })).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Pending invitations' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Invite members' }),
    ).toBeVisible()
  },
}
