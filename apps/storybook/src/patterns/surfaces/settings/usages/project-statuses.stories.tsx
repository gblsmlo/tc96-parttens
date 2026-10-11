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
  PlusIcon,
} from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
          <SettingsSectionHeader>
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
            <SettingsCollapsed
              actions={
                <Button
                  aria-label={`Create new ${title.toLowerCase()} status`}
                  size="icon-xs"
                  variant="ghost"
                >
                  <PlusIcon aria-hidden="true" />
                </Button>
              }
              key={title}
              title={title}
            >
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
  parameters: {
    docs: {
      description: {
        component:
          'A consumer composition of SettingsSection, SettingsCollapsed and SettingsRow. The page heading, status labels, icons, counts and actions live in this story, not in the pattern.',
      },
    },
    layout: 'padded',
  },
  title: 'Patterns/Surfaces/Settings/Usages/Project Statuses',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: () => <StatusesDemo />,
}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole('heading', { name: 'Project statuses', level: 2 }),
    ).toBeVisible()
    expect(canvas.getByRole('region', { name: 'Backlog' })).toBeVisible()
    expect(canvas.getByRole('region', { name: 'Canceled' })).toBeVisible()
    expect(
      canvas.getAllByRole('button', { name: /Create new .* status/ }),
    ).toHaveLength(5)
    expect(canvas.getByText('6 projects')).toBeVisible()

    const title = canvas.getByRole('heading', {
      name: 'Project statuses',
      level: 2,
    })
    const description = canvas.getByText(
      'Project statuses define the workflow that projects go through from start to completion',
    )
    const card = canvasElement.querySelector(
      '[data-slot="card"]',
    ) as HTMLElement

    expect(card).toBeInTheDocument()
    expect(
      card.querySelector('[data-slot="settings-section-rows"]'),
    ).not.toBeNull()

    const groups = Array.from(
      card.querySelectorAll<HTMLElement>('[data-slot="settings-collapsed"]'),
    )
    for (const group of groups) {
      expect(getComputedStyle(group).borderBottomWidth).toBe('0px')
    }
    for (const item of card.querySelectorAll<HTMLElement>(
      '[data-slot="settings-row"]',
    )) {
      expect(getComputedStyle(item).paddingInlineStart).toBe('0px')
      expect(getComputedStyle(item).paddingInlineEnd).toBe('0px')
    }
    const firstHeader = groups[0]?.querySelector('header') as HTMLElement
    const lastItem = groups
      .at(-1)
      ?.querySelector('[data-slot="settings-row"]') as HTMLElement

    expect(
      firstHeader.getBoundingClientRect().top -
        card.getBoundingClientRect().top,
    ).toBeGreaterThanOrEqual(8)
    expect(
      card.getBoundingClientRect().bottom -
        lastItem.getBoundingClientRect().bottom,
    ).toBeGreaterThanOrEqual(8)

    expect(
      Math.abs(
        title.getBoundingClientRect().left - card.getBoundingClientRect().left,
      ),
    ).toBeLessThan(1)
    expect(
      card.getBoundingClientRect().top -
        description.getBoundingClientRect().bottom,
    ).toBeLessThanOrEqual(16)

    const backlog = canvas.getByRole('region', { name: 'Backlog' })
    const backlogTrigger = within(backlog).getByRole('button', {
      name: 'Backlog',
    })
    const addBacklog = within(backlog).getByRole('button', {
      name: 'Create new backlog status',
    })
    await userEvent.click(addBacklog)
    expect(backlogTrigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(backlogTrigger)
    expect(backlogTrigger).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() =>
      expect(within(backlog).queryByText('1 project')).toBeNull(),
    )
    await userEvent.click(backlogTrigger)
    expect(backlogTrigger).toHaveAttribute('aria-expanded', 'true')
  },
  tags: interaction,
}
