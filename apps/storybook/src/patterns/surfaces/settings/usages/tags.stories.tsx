import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
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
import { CornerDownRightIcon, EllipsisIcon, PlusIcon } from 'lucide-react'
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

function TagRow({ label, parent }: { label: Tag; parent?: string }) {
  const { color, leads, name, tasks } = label

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
              <EllipsisIcon aria-hidden="true" />
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
            <CornerDownRightIcon
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

function NewLabelButton() {
  return (
    <Button size="sm" variant="outline">
      <PlusIcon aria-hidden="true" />
      New tag
    </Button>
  )
}

function TagsSection({
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
  parameters: {
    docs: {
      description: {
        component:
          'A consumer composition of SettingsSection, SettingsRow and StateSurface with two tag levels: tags and subtags. The tag data, swatches, counts and menus live in this story, not in the pattern.',
      },
    },
    layout: 'padded',
  },
  title: 'Patterns/Surfaces/Settings/Usages/Tags',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  render: () => (
    <TagsSection actions={<NewLabelButton />}>
      {tags.flatMap((label) => [
        <TagRow key={label.name} label={label} />,
        ...(label.subtags ?? []).map((subtags) => (
          <TagRow key={subtags.name} label={subtags} parent={label.name} />
        )),
      ])}
    </TagsSection>
  ),
}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Tags' }),
    ).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New tag' })).toBeEnabled()

    expect(canvas.getByText('Subtag of Labor')).toBeVisible()
    expect(canvas.getByText('0 leads · 2 tasks')).toBeVisible()
    expect(canvas.getByText('1 lead · 1 task')).toBeVisible()

    const names = tags.flatMap((label) => [
      label.name,
      ...(label.subtags ?? []).map((subtags) => subtags.name),
    ])
    for (const name of names) {
      expect(canvas.getByText(name)).toBeVisible()
      expect(
        canvas.getByRole('button', { name: `Actions for ${name}` }),
      ).toBeEnabled()
    }
    expect(
      canvas.getAllByRole('button', { name: /^Actions for / }),
    ).toHaveLength(names.length)
  },
  tags: interaction,
}

export const Empty: Story = {
  render: () => (
    <TagsSection actions={null}>
      <StateSurface
        actions={<NewLabelButton />}
        description="Create a tag to organize leads and tasks."
        kind="empty"
        title="No tags yet"
      />
    </TagsSection>
  ),
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('status')).toHaveAttribute('data-kind', 'empty')
    expect(canvas.getByText('No tags yet')).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New tag' })).toBeEnabled()
    expect(canvas.queryByRole('button', { name: /^Actions for / })).toBeNull()
  },
  tags: interaction,
}
