import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
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
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

type PhaseId = 'Open' | 'Won' | 'Lost'
type Direction = 'up' | 'down'

interface Stage {
  icon: LucideIcon
  leads: number
  name: string
  phase: PhaseId
  tone: string
}

const phases: PhaseId[] = ['Open', 'Won', 'Lost']

const initialStages: Stage[] = [
  {
    icon: SparklesIcon,
    leads: 4,
    name: 'New',
    phase: 'Open',
    tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-500',
  },
  {
    icon: UserCheckIcon,
    leads: 7,
    name: 'Qualification',
    phase: 'Open',
    tone: 'bg-blue-500/10 text-blue-700 dark:text-blue-500',
  },
  {
    icon: FileTextIcon,
    leads: 3,
    name: 'Proposal',
    phase: 'Open',
    tone: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500',
  },
  {
    icon: HandshakeIcon,
    leads: 2,
    name: 'Negotiation',
    phase: 'Open',
    tone: 'bg-violet-500/10 text-violet-700 dark:text-violet-500',
  },
  {
    icon: TrophyIcon,
    leads: 12,
    name: 'Won',
    phase: 'Won',
    tone: 'bg-green-500/10 text-green-700 dark:text-green-500',
  },
  {
    icon: CircleXIcon,
    leads: 0,
    name: 'Lost',
    phase: 'Lost',
    tone: 'bg-destructive/8 text-destructive-foreground dark:bg-destructive/16',
  },
]

const onNewStage = fn()
const onEditStage = fn()
const onMoveStage = fn()
const onDeleteStage = fn()

function describeStage({ leads, phase }: Stage) {
  const count =
    leads === 0 ? undefined : `${leads} lead${leads === 1 ? '' : 's'}`
  if (phase === 'Open') return count
  const closes = `Closes the lead as ${phase.toLowerCase()}`
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
  const { name, phase } = stage
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
        {phase === 'Open' ? (
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
        ) : null}
      </MenuPopup>
    </Menu>
  )
}

function swap(stages: Stage[], name: string, direction: Direction) {
  const index = stages.findIndex((stage) => stage.name === name)
  const target = direction === 'up' ? index - 1 : index + 1
  const phase = stages[index]?.phase
  if (index < 0 || stages[target]?.phase !== phase) return stages
  const next = [...stages]
  const moved = next[index] as Stage
  next[index] = next[target] as Stage
  next[target] = moved
  return next
}

function PipelineStagesDemo() {
  const [stages, setStages] = useState(initialStages)

  return (
    <main className="mx-auto w-full max-w-2xl">
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              <Button onClick={() => onNewStage()} size="sm">
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
        <div>
          {phases.map((phase) => {
            const group = stages.filter((stage) => stage.phase === phase)
            return (
              <SettingsCollapsed key={phase} title={phase}>
                {group.map((stage, index) => {
                  const { icon: Icon, name, tone } = stage
                  return (
                    <SettingsRow
                      description={describeStage(stage)}
                      endSlot={
                        <StageActions
                          first={index === 0}
                          last={index === group.length - 1}
                          onMove={(direction) => {
                            onMoveStage(name, direction)
                            setStages((current) =>
                              swap(current, name, direction),
                            )
                          }}
                          stage={stage}
                        />
                      }
                      key={name}
                      startSlot={
                        <IconFrame className={tone} shape="rounded">
                          <Icon className="size-4" />
                        </IconFrame>
                      }
                      title={name}
                    />
                  )
                })}
              </SettingsCollapsed>
            )
          })}
        </div>
      </SettingsSection>
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

export const Interaction: Story = {
  ...PipelineStages,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    expect(
      canvas.getByRole('heading', { name: 'Pipeline stages', level: 2 }),
    ).toBeVisible()
    const newStage = canvas.getByRole('button', { name: 'New stage' })
    expect(newStage).toBeVisible()
    expect(newStage.closest('[data-slot="card"]')).toBeNull()
    expect(canvas.queryAllByRole('button', { name: /^Add / })).toHaveLength(0)
    await userEvent.click(newStage)
    expect(onNewStage).toHaveBeenCalledOnce()

    const open = canvas.getByRole('region', { name: 'Open' })
    expect(canvas.getByRole('region', { name: 'Won' })).toBeVisible()
    expect(canvas.getByRole('region', { name: 'Lost' })).toBeVisible()
    expect(
      canvas.getAllByRole('button', { name: /^Actions for / }),
    ).toHaveLength(initialStages.length)
    for (const { name } of initialStages) {
      expect(
        canvas.getByRole('button', { name: `Actions for ${name}` }),
      ).toBeVisible()
    }
    expect(canvas.getByText('Closes the lead as lost')).toBeVisible()

    const firstTitle = () =>
      open
        .querySelector('[data-slot="settings-row-title"]')
        ?.textContent?.trim()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for New' }),
    )
    expect(
      await body.findByRole('menuitem', { name: 'Move up' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Negotiation' }),
    )
    expect(
      await body.findByRole('menuitem', { name: 'Move down' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    expect(firstTitle()).toBe('New')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Qualification' }),
    )
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Move up' }),
    )
    expect(onMoveStage).toHaveBeenCalledWith('Qualification', 'up')
    await waitFor(() => expect(firstTitle()).toBe('Qualification'))

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Qualification' }),
    )
    expect(
      await body.findByRole('menuitem', { name: 'Move up' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Won' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
    expect(body.getAllByRole('menuitem')).toHaveLength(1)
    expect(body.queryByRole('menuitem', { name: 'Delete' })).toBeNull()
    await userEvent.keyboard('{Escape}')
  },
  tags: interaction,
}
