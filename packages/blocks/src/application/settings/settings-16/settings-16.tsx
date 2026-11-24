import { SettingsCollapsed } from '@tc96/parttens/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Button } from '@tc96/ui/button'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings16Labels } from './labels'
import type {
  Settings16Action,
  Settings16CostCenter,
  Settings16Labels,
  Settings16Props,
} from './types'

interface CostCenterRowProps {
  archived?: boolean
  costCenter: Settings16CostCenter
  labels: Settings16Labels
  onCostCenterAction?: Settings16Props['onCostCenterAction']
}

function CostCenterRow({
  archived,
  costCenter,
  labels,
  onCostCenterAction,
}: Readonly<CostCenterRowProps>) {
  const actions = archived
    ? [{ id: 'restore', label: labels.restore }]
    : [
        { id: 'edit', label: labels.edit },
        { destructive: true, id: 'archive', label: labels.archive },
      ]

  return (
    <SettingsRow
      endSlot={
        <div className="flex items-center gap-3">
          <Text
            foreground="muted"
            render={<span>{labels.entries(costCenter.entries)}</span>}
            size="sm"
          />
          {onCostCenterAction ? (
            <SettingsRowActions
              actions={actions}
              label={labels.actions(costCenter.name)}
              onAction={(action) =>
                onCostCenterAction(costCenter.id, action as Settings16Action)
              }
            />
          ) : null}
        </div>
      }
      title={costCenter.name}
    />
  )
}

export function Settings16({
  archivedCostCenters = [],
  className,
  costCenters,
  labels: labelsProp,
  onCostCenterAction,
  onCreate,
}: Readonly<Settings16Props>) {
  const labels = { ...defaultSettings16Labels, ...labelsProp }

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.newCostCenter}
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
      {costCenters.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        costCenters.map((costCenter) => (
          <CostCenterRow
            costCenter={costCenter}
            key={costCenter.id}
            labels={labels}
            onCostCenterAction={onCostCenterAction}
          />
        ))
      )}
      {archivedCostCenters.length > 0 ? (
        <div>
          <SettingsCollapsed defaultOpen={false} title={labels.archived}>
            {archivedCostCenters.map((costCenter) => (
              <CostCenterRow
                archived
                costCenter={costCenter}
                key={costCenter.id}
                labels={labels}
                onCostCenterAction={onCostCenterAction}
              />
            ))}
          </SettingsCollapsed>
        </div>
      ) : null}
    </SettingsSection>
  )
}
