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
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  CircleXIcon,
  EllipsisIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'

const groups = [
  {
    statuses: [
      {
        icon: CircleDashedIcon,
        label: 'Backlog',
        projects: '1 project',
        tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-500',
      },
    ],
    title: 'Backlog',
  },
  {
    statuses: [
      {
        icon: CircleIcon,
        label: 'Planned',
        projects: '3 projects',
        tone: 'text-muted-foreground',
      },
    ],
    title: 'Planned',
  },
  {
    statuses: [
      {
        icon: CircleDotIcon,
        label: 'In Progress',
        projects: '6 projects',
        tone: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500',
      },
    ],
    title: 'In Progress',
  },
  {
    statuses: [
      {
        icon: CircleCheckIcon,
        label: 'Completed',
        projects: undefined,
        tone: 'bg-violet-500/10 text-violet-500',
      },
    ],
    title: 'Completed',
  },
  {
    statuses: [
      {
        icon: CircleXIcon,
        label: 'Canceled',
        projects: undefined,
        tone: 'bg-destructive/8 text-destructive-foreground dark:bg-destructive/16',
      },
    ],
    title: 'Canceled',
  },
]

function StatusesDemo() {
  return (
    <main className="mx-auto w-full max-w-2xl">
      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={<Button size="sm">New status</Button>}
          >
            <SettingsSectionTitle>Project statuses</SettingsSectionTitle>
            <SettingsSectionDescription>
              Project statuses define the workflow that projects go through from
              start to completion
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <div>
          {groups.map(({ statuses, title }) => (
            <SettingsCollapsed key={title} title={title}>
              {statuses.map(({ icon: Icon, label, projects, tone }) => (
                <SettingsRow
                  description={projects}
                  endSlot={
                    <Menu>
                      <MenuTrigger
                        aria-label={`Actions for ${label}`}
                        render={<Button size="icon-xs" variant="ghost" />}
                      >
                        <EllipsisIcon aria-hidden="true" />
                      </MenuTrigger>
                      <MenuPopup align="end">
                        <MenuItem>Edit</MenuItem>
                        <MenuItem variant="destructive">Delete</MenuItem>
                      </MenuPopup>
                    </Menu>
                  }
                  key={label}
                  startSlot={
                    <IconFrame className={tone} shape="rounded">
                      <Icon className="size-4" />
                    </IconFrame>
                  }
                  title={label}
                />
              ))}
            </SettingsCollapsed>
          ))}
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
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const ProjectStatuses: Story = {
  name: 'Project Statuses',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Project statuses' }),
    ).toBeVisible()
    await expect(canvas.getByRole('region', { name: 'Backlog' })).toBeVisible()
    await expect(canvas.getByRole('region', { name: 'Canceled' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New status' }),
    ).toBeVisible()
  },
  render: () => <StatusesDemo />,
}
