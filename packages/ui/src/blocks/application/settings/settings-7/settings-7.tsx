import { ArrowElbowDownRightIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { SettingsSwatch } from '../shared/settings-swatch'
import { defaultSettings7Labels } from './labels'
import { Settings7Skeleton } from './settings-7-skeleton'
import type {
  Settings7Action,
  Settings7Labels,
  Settings7Props,
  Settings7Tag,
} from './types'

interface TagRowProps {
  labels: Settings7Labels
  onTagAction?: Settings7Props['onTagAction']
  parent?: string
  tag: Settings7Tag
}

function TagRow({ labels, onTagAction, parent, tag }: Readonly<TagRowProps>) {
  const actions = [
    { id: 'edit', label: labels.edit },
    ...(parent ? [] : [{ id: 'add-subtag', label: labels.addSubtag }]),
    { destructive: true, id: 'delete', label: labels.delete },
  ]

  return (
    <SettingsRow
      className={parent ? 'ps-2' : undefined}
      description={parent ? labels.subtagOf(parent) : undefined}
      endSlot={
        <div className="flex items-center gap-3">
          <Text
            foreground="muted"
            render={<span>{labels.usage(tag.leads, tag.tasks)}</span>}
            size="sm"
          />
          {onTagAction ? (
            <SettingsRowActions
              actions={actions}
              label={labels.actions(tag.name)}
              onAction={(action) =>
                onTagAction(tag.id, action as Settings7Action)
              }
            />
          ) : null}
        </div>
      }
      startSlot={
        parent ? (
          <span className="flex items-center gap-2">
            <ArrowElbowDownRightIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <SettingsSwatch className={tag.colorClassName} />
          </span>
        ) : (
          <SettingsSwatch className={tag.colorClassName} />
        )
      }
      title={tag.name}
    />
  )
}

export function Settings7({
  error,
  onRetry,
  pending,
  className,
  labels: labelsProp,
  onCreate,
  onTagAction,
  tags,
}: Readonly<Settings7Props>) {
  const labels = { ...defaultSettings7Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings7Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.newTag}
              </Button>
            ) : undefined
          }
        >
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ??
        (tags.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          tags.flatMap((tag) => [
            <TagRow
              key={tag.id}
              labels={labels}
              onTagAction={onTagAction}
              tag={tag}
            />,
            ...(tag.subtags ?? []).map((subtag) => (
              <TagRow
                key={subtag.id}
                labels={labels}
                onTagAction={onTagAction}
                parent={tag.name}
                tag={subtag}
              />
            )),
          ])
        ))}
    </SettingsSection>
  )
}
