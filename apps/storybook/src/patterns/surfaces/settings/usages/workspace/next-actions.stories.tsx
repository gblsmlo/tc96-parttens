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
  RepeatIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, fn, within } from 'storybook/test'

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
        <SettingsSectionHeader actions={<Button size="sm">New action</Button>}>
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
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const NextActions: Story = {
  name: 'Next Actions',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Stage gates' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Next actions' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Block stage changes' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New action' }),
    ).toBeVisible()
  },
  render: () => <NextActionsDemo />,
}

export const NextActionsEmpty: Story = {
  name: 'Next Actions empty',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'empty',
    )
    await expect(canvas.getByText('No next actions yet')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New action' }),
    ).toBeEnabled()
  },
  render: () => <NextActionsDemo empty />,
}
