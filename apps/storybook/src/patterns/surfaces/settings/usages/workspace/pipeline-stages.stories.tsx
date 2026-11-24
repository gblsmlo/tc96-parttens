import {
  DotsThreeIcon,
  FileTextIcon,
  HandshakeIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  SparkleIcon,
  TrophyIcon,
  UserCheckIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  RecordDialog,
  RecordDialogHeadline,
  RecordGroup,
  RecordGroupItem,
  RecordGroupRow,
  SelectProperty,
  type SelectPropertyOption,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns'
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
import { expect, fn, within } from 'storybook/test'

type PhaseId = 'Open' | 'Won' | 'Lost'
type Direction = 'up' | 'down'

interface Stage {
  icon: PhosphorIcon
  leads: number
  locked?: boolean
  name: string
  phase: PhaseId
  tone: string
}

const phases: PhaseId[] = ['Open', 'Won', 'Lost']

const phaseOptions: SelectPropertyOption[] = phases.map((phase) => ({
  label: phase,
  value: phase,
}))

const phaseLooks: Record<PhaseId, Pick<Stage, 'icon' | 'tone'>> = {
  Lost: { icon: XCircleIcon, tone: 'text-destructive-foreground' },
  Open: { icon: RadioButtonIcon, tone: 'text-muted-foreground' },
  Won: { icon: TrophyIcon, tone: 'text-green-700 dark:text-green-500' },
}

const initialStages: Stage[] = [
  {
    icon: SparkleIcon,
    leads: 4,
    name: 'New',
    phase: 'Open',
    tone: 'text-amber-700 dark:text-amber-500',
  },
  {
    icon: UserCheckIcon,
    leads: 7,
    name: 'Qualification',
    phase: 'Open',
    tone: 'text-blue-700 dark:text-blue-500',
  },
  {
    icon: FileTextIcon,
    leads: 3,
    name: 'Proposal',
    phase: 'Open',
    tone: 'text-yellow-700 dark:text-yellow-500',
  },
  {
    icon: HandshakeIcon,
    leads: 2,
    name: 'Negotiation',
    phase: 'Open',
    tone: 'text-violet-700 dark:text-violet-500',
  },
  { ...phaseLooks.Won, leads: 12, locked: true, name: 'Won', phase: 'Won' },
  { ...phaseLooks.Lost, leads: 0, locked: true, name: 'Lost', phase: 'Lost' },
]

const onNewStage = fn()
const onEditStage = fn()
const onMoveStage = fn()
const onDeleteStage = fn()

function describeStage({ leads, phase }: Stage) {
  const count =
    leads === 0 ? undefined : `${leads} lead${leads === 1 ? '' : 's'}`
  if (phase === 'Open') return count
  const closes = `Closes as ${phase.toLowerCase()}`
  return count ? `${count} · ${closes}` : closes
}

function StageActions({
  first,
  last,
  onMove,
  stage,
}: {
  first: boolean
  last: boolean
  onMove: (direction: Direction) => void
  stage: Stage
}) {
  const { locked, name } = stage
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${name}`}
        render={<Button size="icon-xs" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onEditStage(name)}>Edit</MenuItem>
        {locked ? null : (
          <>
            <MenuItem disabled={first} onClick={() => onMove('up')}>
              Move up
            </MenuItem>
            <MenuItem disabled={last} onClick={() => onMove('down')}>
              Move down
            </MenuItem>
            <MenuItem onClick={() => onDeleteStage(name)} variant="destructive">
              Delete
            </MenuItem>
          </>
        )}
      </MenuPopup>
    </Menu>
  )
}

function StageItem({
  first,
  last,
  onMove,
  stage,
}: {
  first: boolean
  last: boolean
  onMove: (direction: Direction) => void
  stage: Stage
}) {
  const { icon: Icon, name, tone } = stage
  const description = describeStage(stage)

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
        <StageActions first={first} last={last} onMove={onMove} stage={stage} />
      </div>
    </RecordGroupItem>
  )
}

function swap(stages: Stage[], name: string, direction: Direction) {
  const index = stages.findIndex((stage) => stage.name === name)
  const phase = stages[index]?.phase
  const step = direction === 'up' ? -1 : 1
  let target = index + step
  while (target >= 0 && target < stages.length) {
    if (stages[target]?.phase === phase) break
    target += step
  }
  if (index < 0 || stages[target]?.phase !== phase) return stages
  const next = [...stages]
  const moved = next[index] as Stage
  next[index] = next[target] as Stage
  next[target] = moved
  return next
}

function isPhase(value: string): value is PhaseId {
  return phases.some((phase) => phase === value)
}

function NewStageDialog({
  names,
  onCreate,
  onOpenChange,
  open,
}: {
  names: string[]
  onCreate: (name: string, phase: PhaseId) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const [name, setName] = useState('')
  const [phase, setPhase] = useState<PhaseId>('Open')
  const trimmed = name.trim()
  const taken = names.some(
    (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
  )

  return (
    <RecordDialog
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setName('')
          setPhase('Open')
        }
      }}
      onSubmit={() => {
        if (trimmed === '' || taken) return false
        onCreate(trimmed, phase)
        setName('')
        setPhase('Open')
        return true
      }}
      open={open}
      size="small"
      submitDisabled={trimmed === '' || taken}
      submitLabel="Create stage"
      submitOnModEnter
      title="New stage"
      titleAncestor="Pipeline stages"
    >
      <div className="grid gap-4">
        <RecordDialogHeadline
          onTitleChange={setName}
          title={name}
          titleLabel="Stage name"
          titlePlaceholder="Stage name"
        />
        <div>
          <RecordGroupRow label="Phase">
            <SelectProperty
              ariaLabel="Phase"
              onValueChange={(value) => {
                if (value && isPhase(value)) setPhase(value)
              }}
              options={phaseOptions}
              value={phase}
            />
          </RecordGroupRow>
        </div>
      </div>
    </RecordDialog>
  )
}

function PipelineStagesDemo() {
  const [stages, setStages] = useState(initialStages)
  const [creating, setCreating] = useState(false)

  return (
    <main className="mx-auto w-full max-w-2xl">
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              <Button onClick={() => setCreating(true)} size="sm">
                New stage
              </Button>
            }
          >
            <SettingsSectionTitle>Pipeline stages</SettingsSectionTitle>
            <SettingsSectionDescription>
              Stages are the steps a lead moves through, grouped by phase
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <div className="flex flex-col gap-3 py-4">
          {phases.map((phase) => {
            const group = stages.filter((stage) => stage.phase === phase)
            return (
              <RecordGroup key={phase} title={phase}>
                {group.map((stage, index) => (
                  <StageItem
                    first={index === 0}
                    key={stage.name}
                    last={index === group.length - 1}
                    onMove={(direction) => {
                      onMoveStage(stage.name, direction)
                      setStages((current) =>
                        swap(current, stage.name, direction),
                      )
                    }}
                    stage={stage}
                  />
                ))}
              </RecordGroup>
            )
          })}
        </div>
      </SettingsSection>
      <NewStageDialog
        names={stages.map((stage) => stage.name)}
        onCreate={(name, phase) => {
          onNewStage(name, phase)
          setStages((current) => [
            ...current,
            { ...phaseLooks[phase], leads: 0, name, phase },
          ])
        }}
        onOpenChange={setCreating}
        open={creating}
      />
    </main>
  )
}

const meta = {
  component: SettingsSection,
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
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const PipelineStages: Story = {
  name: 'Pipeline Stages',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Pipeline stages' }),
    ).toBeVisible()
    for (const phase of phases) {
      await expect(canvas.getByRole('region', { name: phase })).toBeVisible()
    }
    await expect(
      canvas.getByRole('button', { name: 'New stage' }),
    ).toBeVisible()
  },
  render: () => <PipelineStagesDemo />,
}
