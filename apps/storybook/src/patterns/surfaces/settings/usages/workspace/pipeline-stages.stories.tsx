import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
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
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  CircleDotIcon,
  CircleXIcon,
  EllipsisIcon,
  FileTextIcon,
  HandshakeIcon,
  type LucideIcon,
  PlusIcon,
  SparklesIcon,
  TrophyIcon,
  UserCheckIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

type PhaseId = 'Open' | 'Won' | 'Lost'
type Direction = 'up' | 'down'

interface Stage {
  icon: LucideIcon
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
  Lost: { icon: CircleXIcon, tone: 'text-destructive-foreground' },
  Open: { icon: CircleDotIcon, tone: 'text-muted-foreground' },
  Won: { icon: TrophyIcon, tone: 'text-green-700 dark:text-green-500' },
}

const initialStages: Stage[] = [
  {
    icon: SparklesIcon,
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
        <EllipsisIcon aria-hidden="true" />
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
    <RecordGroupItem leading={<Icon className={tone} />} title={name}>
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
                <PlusIcon aria-hidden="true" />
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
  title: 'Patterns/Surfaces/Settings/Usages/Workspace/Pipeline Stages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const PipelineStages: Story = {
  name: 'Pipeline Stages',
  render: () => <PipelineStagesDemo />,
}

const titlesIn = (region: HTMLElement) =>
  Array.from(
    region.querySelectorAll('[data-slot="record-group-item-title"]'),
    (title) => title.textContent?.trim(),
  )

export const Interaction: Story = {
  ...PipelineStages,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    expect(
      canvas.getByRole('heading', { name: 'Pipeline stages', level: 2 }),
    ).toBeVisible()
    const card = canvasElement.querySelector(
      '[data-slot="card"]',
    ) as HTMLElement
    const newStage = canvas.getByRole('button', { name: 'New stage' })
    expect(newStage.closest('[data-slot="card"]')).toBeNull()
    expect(canvas.queryAllByRole('button', { name: /^Add / })).toHaveLength(0)

    const open = canvas.getByRole('region', { name: 'Open' })
    const won = canvas.getByRole('region', { name: 'Won' })
    const lost = canvas.getByRole('region', { name: 'Lost' })
    for (const region of [open, won, lost]) {
      expect(card).toContainElement(region)
    }
    expect(titlesIn(open)).toEqual([
      'New',
      'Qualification',
      'Proposal',
      'Negotiation',
    ])
    expect(
      canvas.getAllByRole('button', { name: /^Actions for / }),
    ).toHaveLength(initialStages.length)
    expect(canvas.getByText('Closes as lost')).toBeVisible()

    const cardBox = card.getBoundingClientRect()
    const firstBox = open.getBoundingClientRect()
    const lastBox = lost.getBoundingClientRect()
    const inset = firstBox.top - cardBox.top
    expect(inset).toBeGreaterThanOrEqual(8)
    expect(firstBox.left - cardBox.left).toBeCloseTo(inset, 0)
    expect(cardBox.right - firstBox.right).toBeCloseTo(inset, 0)
    expect(cardBox.bottom - lastBox.bottom).toBeCloseTo(inset, 0)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for New' }),
    )
    expect(
      await body.findByRole('menuitem', { name: 'Move up' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Qualification' }),
    )
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Move up' }),
    )
    expect(onMoveStage).toHaveBeenCalledWith('Qualification', 'up')
    await waitFor(() => expect(titlesIn(open)[0]).toBe('Qualification'))

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Won' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
    expect(body.getAllByRole('menuitem')).toHaveLength(1)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(newStage)
    const dialog = within(
      await screen.findByRole('dialog', { name: /New stage/ }),
    )
    const create = dialog.getByRole('button', { name: /Create stage/ })
    expect(create).toBeDisabled()
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Stage name' }),
      'Disqualified',
    )
    await userEvent.click(dialog.getByRole('combobox', { name: /^Phase/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Lost' }))
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Phase/ }),
      ).toHaveTextContent('Lost'),
    )
    await userEvent.click(create)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(onNewStage).toHaveBeenCalledWith('Disqualified', 'Lost')
    expect(titlesIn(lost)).toEqual(['Lost', 'Disqualified'])

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Disqualified' }),
    )
    expect(
      await body.findByRole('menuitem', { name: 'Move up' }),
    ).not.toHaveAttribute('aria-disabled', 'true')
    expect(body.getByRole('menuitem', { name: 'Delete' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
  },
  tags: interaction,
}
