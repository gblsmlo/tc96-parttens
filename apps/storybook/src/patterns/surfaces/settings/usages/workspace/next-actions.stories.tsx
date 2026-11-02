import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
import {
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
  StateSurface,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Switch } from '@tc96/ui/switch'
import {
  CalendarIcon,
  EllipsisIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  RepeatIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

type ActionType = 'call' | 'email' | 'meeting' | 'proposal' | 'follow-up'

interface NextAction {
  required: boolean
  title: string
  type: ActionType
}

interface Stage {
  actions: NextAction[]
  name: string
}

const actionTypes = {
  call: { icon: PhoneIcon, label: 'Call' },
  email: { icon: MailIcon, label: 'Email' },
  'follow-up': { icon: RepeatIcon, label: 'Follow-up' },
  meeting: { icon: CalendarIcon, label: 'Meeting' },
  proposal: { icon: FileTextIcon, label: 'Proposal' },
} as const

const stages: Stage[] = [
  {
    actions: [
      { required: true, title: 'Log the first call', type: 'call' },
      { required: false, title: 'Send a welcome email', type: 'email' },
    ],
    name: 'New',
  },
  {
    actions: [
      {
        required: true,
        title: 'Schedule a discovery meeting',
        type: 'meeting',
      },
      {
        required: false,
        title: 'Confirm budget and timeline',
        type: 'follow-up',
      },
    ],
    name: 'Qualification',
  },
  {
    actions: [
      { required: true, title: 'Send the proposal', type: 'proposal' },
      {
        required: false,
        title: 'Follow up on the proposal',
        type: 'follow-up',
      },
    ],
    name: 'Proposal',
  },
  { actions: [], name: 'Negotiation' },
]

const onBlockChange = fn()
const onRequiredChange = fn()

function ActionRow({ action }: { action: NextAction }) {
  const { required, title, type } = action
  const { icon: Icon, label } = actionTypes[type]

  return (
    <SettingsRow
      description={label}
      endSlot={
        <>
          <Switch
            aria-label={`Required: ${title}`}
            defaultChecked={required}
            onCheckedChange={(checked) => onRequiredChange(title, checked)}
          />
          <Menu>
            <MenuTrigger
              aria-label={`Actions for ${title}`}
              render={<Button size="icon-xs" variant="ghost" />}
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem>Edit</MenuItem>
              <MenuItem variant="destructive">Delete</MenuItem>
            </MenuPopup>
          </Menu>
        </>
      }
      startSlot={<Icon aria-hidden="true" className="text-muted-foreground" />}
      title={title}
    />
  )
}

function StageGates() {
  return (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Stage gates</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        description="Leads cannot move to the next stage until every required action is done. Off only warns."
        endSlot={
          <Switch
            aria-label="Block stage changes"
            onCheckedChange={onBlockChange}
          />
        }
        title="Block stage changes"
      />
    </SettingsSection>
  )
}

function NextActionsSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      header={
        <SettingsSectionHeader
          actions={
            <Button size="sm">
              <PlusIcon aria-hidden="true" />
              New action
            </Button>
          }
        >
          <SettingsSectionTitle>Next actions</SettingsSectionTitle>
          <SettingsSectionDescription>
            Actions a lead needs before it leaves each open stage.
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {children}
    </SettingsSection>
  )
}

function NextActionsDemo({ empty = false }: { empty?: boolean }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <StageGates />
      <NextActionsSection>
        {empty ? (
          <StateSurface
            description="Add actions to the stages leads move through."
            kind="empty"
            title="No next actions yet"
          />
        ) : (
          <div>
            {stages.map(({ actions, name }) => (
              <SettingsCollapsed key={name} title={`Leaving ${name}`}>
                {actions.length === 0 ? (
                  <Text
                    foreground="muted"
                    render={<p className="py-3" />}
                    size="sm"
                  >
                    Leads move on without required actions
                  </Text>
                ) : (
                  actions.map((action) => (
                    <ActionRow action={action} key={action.title} />
                  ))
                )}
              </SettingsCollapsed>
            ))}
          </div>
        )}
      </NextActionsSection>
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
  title: 'Patterns/Surfaces/Settings/Usages/Workspace/Next Actions',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const NextActions: Story = {
  name: 'Next Actions',
  render: () => <NextActionsDemo />,
}

export const Empty: Story = {
  render: () => <NextActionsDemo empty />,
}

export const Interaction: Story = {
  ...NextActions,
  play: async ({ canvasElement }) => {
    onBlockChange.mockClear()
    onRequiredChange.mockClear()
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Stage gates' }),
    ).toBeVisible()
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Next actions' }),
    ).toBeVisible()

    const block = canvas.getByRole('switch', { name: 'Block stage changes' })
    expect(block).toBeVisible()
    expect(block).not.toBeChecked()

    const newAction = canvas.getByRole('button', { name: 'New action' })
    expect(newAction).toBeEnabled()
    expect(newAction.closest('[data-slot="card"]')).toBeNull()

    for (const { actions, name } of stages) {
      const group = canvas.getByRole('region', { name: `Leaving ${name}` })
      expect(group).toBeVisible()
      expect(within(group).queryByRole('button', { name: /^Add / })).toBeNull()
      expect(within(group).queryAllByRole('switch')).toHaveLength(
        actions.length,
      )
      expect(
        within(group).queryAllByRole('button', { name: /^Actions for / }),
      ).toHaveLength(actions.length)
    }
    expect(canvas.getAllByRole('region')).toHaveLength(stages.length + 2)
    expect(canvas.queryByRole('region', { name: 'Leaving Won' })).toBeNull()
    expect(canvas.queryByRole('region', { name: 'Leaving Lost' })).toBeNull()

    const negotiation = canvas.getByRole('region', {
      name: 'Leaving Negotiation',
    })
    expect(
      within(negotiation).getByText('Leads move on without required actions'),
    ).toBeVisible()

    const welcome = canvas.getByRole('switch', {
      name: 'Required: Send a welcome email',
    })
    expect(welcome).not.toBeChecked()
    expect(canvas.getByText('Email')).toBeVisible()
    await userEvent.click(welcome)
    await waitFor(() => expect(welcome).toBeChecked())
    expect(onRequiredChange).toHaveBeenCalledTimes(1)
    expect(onRequiredChange.mock.calls[0]).toEqual([
      'Send a welcome email',
      true,
    ])

    const firstCall = canvas.getByRole('switch', {
      name: 'Required: Log the first call',
    })
    expect(firstCall).toBeChecked()
    await userEvent.click(firstCall)
    await waitFor(() => expect(firstCall).not.toBeChecked())
    expect(onRequiredChange.mock.calls[1]).toEqual([
      'Log the first call',
      false,
    ])

    await userEvent.click(block)
    await waitFor(() => expect(block).toBeChecked())
    expect(onBlockChange.mock.calls[0]?.[0]).toBe(true)

    const end = firstCall.closest('[data-slot="settings-row-end"]')
    const menu = canvas.getByRole('button', {
      name: 'Actions for Log the first call',
    })
    expect(end).toContainElement(menu)
    expect(firstCall.getBoundingClientRect().right).toBeLessThanOrEqual(
      menu.getBoundingClientRect().left,
    )
  },
  tags: interaction,
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('status')).toHaveAttribute('data-kind', 'empty')
    expect(canvas.getByText('No next actions yet')).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New action' })).toBeEnabled()
    expect(within(canvas.getByRole('status')).queryByRole('button')).toBeNull()
    expect(
      canvas.getByRole('switch', { name: 'Block stage changes' }),
    ).toBeVisible()
    expect(canvas.queryByRole('button', { name: /^Actions for / })).toBeNull()
    expect(canvas.queryByRole('region', { name: /^Leaving / })).toBeNull()
  },
  tags: interaction,
}
