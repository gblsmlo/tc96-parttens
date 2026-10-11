import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
import {
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
  StateSurface,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Group, GroupSeparator } from '@tc96/ui/group'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  CircleXIcon,
  EllipsisIcon,
  FlameIcon,
  OctagonAlertIcon,
  PlusIcon,
  SignalHighIcon,
  SignalMediumIcon,
  TimerIcon,
} from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import { expect, within } from 'storybook/test'

type Rule = {
  action: { icon: ComponentType<{ className?: string }>; text: string }
  field: string
  id: string
  operator: string
  value: { icon: ComponentType<{ className?: string }>; label: string }
}

const rules: Rule[] = [
  {
    action: { icon: FlameIcon, text: 'Add SLA of 24 hours from escalation' },
    field: 'Priority',
    id: 'urgent',
    operator: 'is',
    value: { icon: OctagonAlertIcon, label: 'Urgent' },
  },
  {
    action: { icon: TimerIcon, text: 'Add SLA of 1 week from escalation' },
    field: 'Priority',
    id: 'high',
    operator: 'is',
    value: { icon: SignalHighIcon, label: 'High' },
  },
  {
    action: { icon: CircleXIcon, text: 'Remove SLA' },
    field: 'Priority',
    id: 'medium',
    operator: 'is',
    value: { icon: SignalMediumIcon, label: 'Medium' },
  },
]

function RuleItem({ rule }: { rule: Rule }) {
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
            render={<span>When</span>}
            size="sm"
          />
          <Group aria-label="Condition">
            <Badge variant="outline">{field}</Badge>
            <GroupSeparator />
            <Badge variant="outline">{operator}</Badge>
            <GroupSeparator />
            <Badge variant="outline">
              <ValueIcon aria-hidden="true" />
              {value.label}
            </Badge>
          </Group>
        </div>
        <div className="flex items-center gap-2">
          <Text
            className="w-10"
            foreground="muted"
            render={<span>Then</span>}
            size="sm"
          />
          <ActionIcon aria-hidden="true" className="size-4 text-foreground" />
          <Text render={<span>{action.text}</span>} size="sm" />
        </div>
      </div>
      <Menu>
        <MenuTrigger
          aria-label={`Actions for ${field} ${operator} ${value.label}`}
          render={<Button size="icon-xs" variant="ghost" />}
        >
          <EllipsisIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuItem>Edit</MenuItem>
          <MenuItem variant="destructive">Delete</MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  )
}

function AddRuleButton() {
  return (
    <Button size="sm" variant="outline">
      <PlusIcon aria-hidden="true" />
      Add rule
    </Button>
  )
}

function AutomationRules({
  actions,
  children,
}: {
  actions: ReactNode
  children: ReactNode
}) {
  return (
    <SettingsSection
      className="mx-auto w-full max-w-2xl"
      header={
        <SettingsSectionHeader actions={actions}>
          <SettingsSectionTitle>Automation rules</SettingsSectionTitle>
          <SettingsSectionDescription>
            Use automation rules to automatically add or remove SLAs based on
            filters.
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {children}
    </SettingsSection>
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
  parameters: {
    docs: {
      description: {
        component:
          'A consumer composition of SettingsSection and StateSurface. The rule model and menus live in this story, not in the pattern.',
      },
    },
    layout: 'padded',
  },
  title: 'Patterns/Surfaces/Settings/Usages/Automation',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: () => (
    <AutomationRules actions={<AddRuleButton />}>
      {rules.map((rule) => (
        <RuleItem key={rule.id} rule={rule} />
      ))}
    </AutomationRules>
  ),
}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Automation rules' }),
    ).toBeVisible()
    expect(canvas.getByRole('button', { name: 'Add rule' })).toBeEnabled()

    const conditions = canvas.getAllByRole('group', { name: 'Condition' })
    expect(conditions).toHaveLength(3)
    const urgent = within(conditions[0] as HTMLElement)
    expect(urgent.getByText('Priority')).toBeVisible()
    expect(urgent.getByText('is')).toBeVisible()
    expect(urgent.getByText('Urgent')).toBeVisible()

    for (const group of conditions) {
      const badges = group.querySelectorAll('[data-slot="badge"]')
      const separators = group.querySelectorAll('[data-slot="separator"]')
      expect(badges).toHaveLength(3)
      expect(separators).toHaveLength(2)
      const badgeHeight = badges[0]?.getBoundingClientRect().height
      for (const separator of separators) {
        expect(separator.getBoundingClientRect().height).toBe(badgeHeight)
      }
    }

    const triggers = canvas.getAllByRole('button', { name: /^Actions for / })
    expect(triggers).toHaveLength(3)
    for (const trigger of triggers) {
      expect(trigger).toBeEnabled()
    }
  },
  tags: interaction,
}

export const Empty: Story = {
  render: () => (
    <AutomationRules actions={null}>
      <StateSurface
        actions={<AddRuleButton />}
        description="Add a rule to apply or remove SLAs automatically."
        kind="empty"
        title="No rules yet"
      />
    </AutomationRules>
  ),
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('status')).toHaveAttribute('data-kind', 'empty')
    expect(canvas.getByText('No rules yet')).toBeVisible()
    expect(canvas.getByRole('button', { name: 'Add rule' })).toBeEnabled()
    expect(canvas.queryByRole('group', { name: 'Condition' })).toBeNull()
  },
  tags: interaction,
}
