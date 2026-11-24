import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { settingsLoadState } from '../shared/settings-load-state'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings6Labels } from './labels'
import { Settings6Skeleton } from './settings-6-skeleton'
import type {
  Settings6InvitationAction,
  Settings6Labels,
  Settings6Member,
  Settings6MemberAction,
  Settings6Props,
  Settings6Role,
} from './types'

interface MemberRowProps {
  labels: Settings6Labels
  member: Settings6Member
  onMemberAction?: Settings6Props['onMemberAction']
  onRoleChange?: Settings6Props['onRoleChange']
  owner: boolean
  roles: Settings6Role[]
}

function MemberRow({
  labels,
  member,
  onMemberAction,
  onRoleChange,
  owner,
  roles,
}: Readonly<MemberRowProps>) {
  const [role, setRole] = useState(member.role)

  return (
    <SettingsRow
      description={member.email}
      endSlot={
        owner ? (
          <Text
            foreground="muted"
            render={<span>{labels.owner}</span>}
            size="sm"
          />
        ) : (
          <div className="flex items-center gap-3">
            <Select
              items={roles}
              onValueChange={(next) => {
                if (!next) return
                setRole(next)
                onRoleChange?.(member.id, next)
              }}
              value={role}
            >
              <SelectTrigger
                aria-label={labels.memberRole(member.name)}
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
            {onMemberAction ? (
              <SettingsRowActions
                actions={[
                  {
                    destructive: true,
                    id: 'remove',
                    label: labels.removeMember,
                  },
                ]}
                label={labels.actions(member.name)}
                onAction={(action) =>
                  onMemberAction(member.id, action as Settings6MemberAction)
                }
              />
            ) : null}
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

export function Settings6({
  error,
  onRetry,
  pending,
  className,
  invitations,
  labels: labelsProp,
  members,
  onInvitationAction,
  onInvite,
  onMemberAction,
  onRoleChange,
  ownerRole = 'owner',
  roles,
  seats,
}: Readonly<Settings6Props>) {
  const labels = { ...defaultSettings6Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings6Skeleton />,
  })
  const roleLabel = (role: string) =>
    roles.find((option) => option.value === role)?.label ?? role

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-8', className)}
    >
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              onInvite ? (
                <Button onClick={onInvite} size="sm">
                  {labels.invite}
                </Button>
              ) : undefined
            }
          >
            <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
            {seats ? (
              <SettingsSectionDescription>
                {labels.seats(members.length, seats.limit, seats.plan)}
              </SettingsSectionDescription>
            ) : null}
          </SettingsSectionHeader>
        }
      >
        {loadState ??
          members.map((member) => (
            <MemberRow
              key={member.id}
              labels={labels}
              member={member}
              onMemberAction={onMemberAction}
              onRoleChange={onRoleChange}
              owner={member.role === ownerRole}
              roles={roles}
            />
          ))}
      </SettingsSection>
      {!loadState && invitations.length > 0 ? (
        <SettingsSection
          header={
            <SettingsSectionHeader>
              <SettingsSectionTitle>
                {labels.invitationsTitle}
              </SettingsSectionTitle>
            </SettingsSectionHeader>
          }
        >
          {invitations.map((invitation) => (
            <SettingsRow
              description={labels.invitationMeta(
                roleLabel(invitation.role),
                invitation.sent,
              )}
              endSlot={
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{labels.pending}</Badge>
                  {onInvitationAction ? (
                    <SettingsRowActions
                      actions={[
                        { id: 'resend', label: labels.resendInvitation },
                        {
                          destructive: true,
                          id: 'revoke',
                          label: labels.revokeInvitation,
                        },
                      ]}
                      label={labels.actions(invitation.email)}
                      onAction={(action) =>
                        onInvitationAction(
                          invitation.id,
                          action as Settings6InvitationAction,
                        )
                      }
                    />
                  ) : null}
                </div>
              }
              key={invitation.id}
              title={invitation.email}
            />
          ))}
        </SettingsSection>
      ) : null}
    </div>
  )
}
