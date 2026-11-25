import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Group, GroupSeparator } from '@tc96/ui/group'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { defaultSettingsCatalog3Labels } from './labels'
import { SettingsCatalog3Skeleton } from './settings-catalog-3-skeleton'
import type {
  SettingsCatalog3Action,
  SettingsCatalog3Labels,
  SettingsCatalog3Props,
  SettingsCatalog3Rule,
} from './types'

interface RuleItemProps {
  labels: SettingsCatalog3Labels
  onRuleAction?: SettingsCatalog3Props['onRuleAction']
  rule: SettingsCatalog3Rule
}

function RuleItem({ labels, onRuleAction, rule }: Readonly<RuleItemProps>) {
  const { action, field, operator, value } = rule
  const ValueIcon = value.icon
  const ActionIcon = action.icon

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Text
            className="w-10"
            foreground="muted"
            render={<span>{labels.whenLabel}</span>}
            size="sm"
          />
          <Group aria-label={labels.condition}>
            <Badge variant="outline">{field}</Badge>
            <GroupSeparator />
            <Badge variant="outline">{operator}</Badge>
            <GroupSeparator />
            <Badge variant="outline">
              {ValueIcon ? <ValueIcon aria-hidden="true" /> : null}
              {value.label}
            </Badge>
          </Group>
        </div>
        <div className="flex items-center gap-2">
          <Text
            className="w-10"
            foreground="muted"
            render={<span>{labels.thenLabel}</span>}
            size="sm"
          />
          {ActionIcon ? (
            <ActionIcon aria-hidden="true" className="size-4 text-foreground" />
          ) : null}
          <Text render={<span>{action.text}</span>} size="sm" />
        </div>
      </div>
      {onRuleAction ? (
        <SettingsRowActions
          actions={[
            { id: 'edit', label: labels.edit },
            { destructive: true, id: 'delete', label: labels.delete },
          ]}
          label={labels.actions(field, operator, value.label)}
          onAction={(next) =>
            onRuleAction(rule.id, next as SettingsCatalog3Action)
          }
        />
      ) : null}
    </div>
  )
}

export function SettingsCatalog3({
  error,
  onRetry,
  pending,
  className,
  labels: labelsProp,
  onCreate,
  onRuleAction,
  rules,
}: Readonly<SettingsCatalog3Props>) {
  const labels = { ...defaultSettingsCatalog3Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsCatalog3Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.addRule}
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
        (rules.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          rules.map((rule) => (
            <RuleItem
              key={rule.id}
              labels={labels}
              onRuleAction={onRuleAction}
              rule={rule}
            />
          ))
        ))}
    </SettingsSection>
  )
}
