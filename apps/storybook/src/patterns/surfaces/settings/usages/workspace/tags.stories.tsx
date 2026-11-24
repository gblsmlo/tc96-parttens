import { ArrowElbowDownRightIcon, DotsThreeIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
  StateSurface,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Text } from '@tc96/ui/text'
import type { ReactNode } from 'react'
import { expect, within } from 'storybook/test'

interface Tag {
  color: string
  leads: number
  name: string
  subtags?: Tag[]
  tasks: number
}

const tags: Tag[] = [
  {
    color: 'bg-violet-700 dark:bg-violet-500',
    leads: 2,
    name: 'VIP client',
    tasks: 1,
  },
  {
    color: 'bg-green-700 dark:bg-green-500',
    leads: 2,
    name: 'Documents',
    tasks: 2,
  },
  {
    color: 'bg-orange-700 dark:bg-orange-500',
    leads: 0,
    name: 'Deadline',
    tasks: 2,
  },
  {
    color: 'bg-blue-700 dark:bg-blue-500',
    leads: 2,
    name: 'Labor',
    subtags: [
      {
        color: 'bg-blue-700 dark:bg-blue-500',
        leads: 1,
        name: 'Termination',
        tasks: 1,
      },
    ],
    tasks: 1,
  },
  {
    color: 'bg-red-700 dark:bg-red-500',
    leads: 2,
    name: 'Urgent',
    tasks: 2,
  },
]

function count(value: number, noun: string) {
  return `${value} ${noun}${value === 1 ? '' : 's'}`
}

function Swatch({ color }: { color: string }) {
  return <span aria-hidden="true" className={`size-3 rounded-full ${color}`} />
}

function TagRow({ tag, parent }: { tag: Tag; parent?: string }) {
  const { color, leads, name, tasks } = tag

  return (
    <SettingsRow
      className={parent ? 'ps-2' : undefined}
      description={parent ? `Subtag of ${parent}` : undefined}
      endSlot={
        <div className="flex items-center gap-3">
          <Text
            foreground="muted"
            render={
              <span>
                {count(leads, 'lead')} · {count(tasks, 'task')}
              </span>
            }
            size="sm"
          />
          <Menu>
            <MenuTrigger
              aria-label={`Actions for ${name}`}
              render={<Button size="icon-xs" variant="ghost" />}
            >
              <DotsThreeIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem>Edit</MenuItem>
              {parent ? null : <MenuItem>Add subtag</MenuItem>}
              <MenuItem variant="destructive">Delete</MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      }
      startSlot={
        parent ? (
          <span className="flex items-center gap-2">
            <ArrowElbowDownRightIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <Swatch color={color} />
          </span>
        ) : (
          <Swatch color={color} />
        )
      }
      title={name}
    />
  )
}

function TagsSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      className="mx-auto w-full max-w-2xl"
      header={
        <SettingsSectionHeader actions={<Button size="sm">New tag</Button>}>
          <SettingsSectionTitle>Tags</SettingsSectionTitle>
          <SettingsSectionDescription>
            Organize leads and tasks with tags and subtags.
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
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Tags: Story = {
  name: 'Tags',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Tags' }),
    ).toBeVisible()
    await expect(canvas.getByText('Subtag of Labor')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'New tag' })).toBeVisible()
  },
  render: () => (
    <TagsSection>
      {tags.flatMap((tag) => [
        <TagRow key={tag.name} tag={tag} />,
        ...(tag.subtags ?? []).map((subtags) => (
          <TagRow key={subtags.name} tag={subtags} parent={tag.name} />
        )),
      ])}
    </TagsSection>
  ),
}

export const TagsEmpty: Story = {
  name: 'Tags empty',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'empty',
    )
    await expect(canvas.getByText('No tags yet')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'New tag' })).toBeEnabled()
  },
  render: () => (
    <TagsSection>
      <StateSurface
        description="Create a tag to organize leads and tasks."
        kind="empty"
        title="No tags yet"
      />
    </TagsSection>
  ),
}
