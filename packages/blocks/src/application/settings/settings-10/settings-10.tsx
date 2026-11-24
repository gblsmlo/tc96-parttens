import { DotsThreeIcon } from '@phosphor-icons/react'
import { SelectProperty } from '@tc96/parttens/properties/display/select/select-property'
import { RecordDialog } from '@tc96/parttens/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogHeadline } from '@tc96/parttens/records/dialog/composition/record-dialog/record-dialog-headline'
import { RecordGroup } from '@tc96/parttens/records/group/composition/record-group/record-group'
import { RecordGroupItem } from '@tc96/parttens/records/group/composition/record-group-item/record-group-item'
import { RecordGroupRow } from '@tc96/parttens/records/group/composition/record-group-row/record-group-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { settingsLoadState } from '../shared/settings-load-state'
import { defaultSettings10Labels } from './labels'
import { Settings10Skeleton } from './settings-10-skeleton'
import type {
  Settings10Action,
  Settings10Labels,
  Settings10Phase,
  Settings10Props,
  Settings10Stage,
} from './types'

interface StageItemProps {
  first: boolean
  labels: Settings10Labels
  last: boolean
  onStageAction?: Settings10Props['onStageAction']
  phase: Settings10Phase
  stage: Settings10Stage
}

function StageItem({
  first,
  labels,
  last,
  onStageAction,
  phase,
  stage,
}: Readonly<StageItemProps>) {
  const { icon: Icon, name, tone } = stage
  const description = labels.stageDescription(
    stage.leads,
    phase.label,
    phase.closed === true,
  )
  const run = (action: Settings10Action) => onStageAction?.(stage.id, action)

  return (
    <RecordGroupItem
      leading={<Icon aria-hidden="true" className={tone} />}
      title={name}
    >
      <div className="flex min-w-0 items-center gap-3">
        {description ? (
          <Text
            className="truncate"
            foreground="muted"
            render={<span>{description}</span>}
            size="sm"
          />
        ) : null}
        {onStageAction ? (
          <Menu>
            <MenuTrigger
              aria-label={labels.actions(name)}
              render={<Button size="icon-sm" variant="ghost" />}
            >
              <DotsThreeIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem onClick={() => run('edit')}>{labels.edit}</MenuItem>
              {stage.locked ? null : (
                <>
                  <MenuItem disabled={first} onClick={() => run('move-up')}>
                    {labels.moveUp}
                  </MenuItem>
                  <MenuItem disabled={last} onClick={() => run('move-down')}>
                    {labels.moveDown}
                  </MenuItem>
                  <MenuItem onClick={() => run('delete')} variant="destructive">
                    {labels.delete}
                  </MenuItem>
                </>
              )}
            </MenuPopup>
          </Menu>
        ) : null}
      </div>
    </RecordGroupItem>
  )
}

interface NewStageDialogProps {
  labels: Settings10Labels
  names: string[]
  onCreate?: Settings10Props['onStageCreate']
  onOpenChange: (open: boolean) => void
  open: boolean
  phases: Settings10Phase[]
}

function NewStageDialog({
  labels,
  names,
  onCreate,
  onOpenChange,
  open,
  phases,
}: Readonly<NewStageDialogProps>) {
  const defaultPhase = phases[0]?.id ?? ''
  const [name, setName] = useState('')
  const [phase, setPhase] = useState(defaultPhase)
  const trimmed = name.trim()
  const taken = names.some(
    (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
  )
  const options = phases.map((item) => ({ label: item.label, value: item.id }))

  const reset = () => {
    setName('')
    setPhase(defaultPhase)
  }

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
      onSubmit={() => {
        if (trimmed === '' || taken) return false
        onCreate?.(trimmed, phase)
        reset()
        return true
      }}
      open={open}
      size="small"
      submitDisabled={trimmed === '' || taken}
      submitLabel={labels.createStage}
      submitOnModEnter
      title={labels.dialogTitle}
      titleAncestor={labels.dialogAncestor}
    >
      <div className="grid gap-4">
        <RecordDialogHeadline
          onTitleChange={setName}
          title={name}
          titleLabel={labels.stageName}
          titlePlaceholder={labels.stageName}
        />
        <div>
          <RecordGroupRow label={labels.phase}>
            <SelectProperty
              ariaLabel={labels.phase}
              onValueChange={(value) => {
                if (value) setPhase(value)
              }}
              options={options}
              value={phase}
            />
          </RecordGroupRow>
        </div>
      </div>
    </RecordDialog>
  )
}

export function Settings10({
  error,
  onRetry,
  pending,
  className,
  labels: labelsProp,
  onStageAction,
  onStageCreate,
  phases,
  stages,
}: Readonly<Settings10Props>) {
  const labels = { ...defaultSettings10Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings10Skeleton />,
  })
  const [creating, setCreating] = useState(false)

  return (
    <main className={cn('mx-auto w-full max-w-2xl', className)}>
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              onStageCreate ? (
                <Button onClick={() => setCreating(true)} size="sm">
                  {labels.newStage}
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
        {loadState ?? (
          <div className="flex flex-col gap-3 py-4">
            {phases.map((phase) => {
              const group = stages.filter((stage) => stage.phase === phase.id)
              return (
                <RecordGroup key={phase.id} title={phase.label}>
                  {group.map((stage, index) => (
                    <StageItem
                      first={index === 0}
                      key={stage.id}
                      labels={labels}
                      last={index === group.length - 1}
                      onStageAction={onStageAction}
                      phase={phase}
                      stage={stage}
                    />
                  ))}
                </RecordGroup>
              )
            })}
          </div>
        )}
      </SettingsSection>
      {onStageCreate ? (
        <NewStageDialog
          labels={labels}
          names={stages.map((stage) => stage.name)}
          onCreate={onStageCreate}
          onOpenChange={setCreating}
          open={creating}
          phases={phases}
        />
      ) : null}
    </main>
  )
}
