import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from '@tc96/ui/command'
import { useState } from 'react'
import { expect, screen, within } from 'storybook/test'
import type { CommandEntry, CommandEntryGroup } from './command-data.ts'
import { ShortcutCommand } from './command-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Command/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const workspaceCommands: CommandEntryGroup[] = [
  {
    items: [
      { label: 'Inbox', shortcut: 'G I', value: 'inbox' },
      { label: 'My issues', shortcut: 'G M', value: 'my-issues' },
      { label: 'Projects', shortcut: 'G P', value: 'projects' },
      { label: 'Cycles', value: 'cycles' },
    ],
    value: 'Go to',
  },
  {
    items: [
      { label: 'New issue', shortcut: 'C', value: 'new-issue' },
      { label: 'New project', value: 'new-project' },
      { label: 'Invite people', value: 'invite' },
    ],
    value: 'Create',
  },
  {
    items: [
      { label: 'Switch to dark theme', value: 'dark-theme' },
      { label: 'Show keyboard shortcuts', shortcut: '?', value: 'shortcuts' },
    ],
    value: 'Preferences',
  },
]

export const WorkspaceCommands: Story = {
  render: () => (
    <ShortcutCommand
      defaultOpen
      empty="No commands match your search."
      groups={workspaceCommands}
      label="Workspace commands"
      placeholder="Type a command or search…"
      trigger="Search workspace"
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Workspace commands',
    })
    await expect(
      within(dialog).getByRole('group', { name: 'Create' }),
    ).toBeVisible()
    await expect(
      within(dialog).getByRole('option', { name: /New issue/ }),
    ).toBeVisible()
    await expect(within(dialog).getByText('Navigate')).toBeVisible()
  },
}

const recentFiles: CommandEntry[] = [
  { label: 'app/routes/billing.tsx', value: 'billing-route' },
  { label: 'app/routes/settings/profile.tsx', value: 'profile-route' },
  { label: 'components/invoice-table.tsx', value: 'invoice-table' },
  { label: 'lib/format-currency.ts', value: 'format-currency' },
  { label: 'README.md', value: 'readme' },
]

export const GoToFile: Story = {
  render: () => (
    <div className="w-96 max-w-full">
      <Command items={recentFiles}>
        <CommandInput aria-label="Go to file" placeholder="Go to file…" />
        <CommandPanel>
          <CommandEmpty>No files match that name.</CommandEmpty>
          <CommandList>
            {(file: CommandEntry) => (
              <CommandItem key={file.value} value={file}>
                {file.label}
              </CommandItem>
            )}
          </CommandList>
        </CommandPanel>
      </Command>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Go to file' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('option', { name: 'lib/format-currency.ts' }),
    ).toBeVisible()
  },
}

const projects: CommandEntry[] = [
  { label: 'Mobile app redesign', value: 'mobile-app' },
  { label: 'Q4 planning', value: 'q4-planning' },
  { label: 'Billing migration', value: 'billing-migration' },
  { label: 'Customer onboarding', value: 'onboarding' },
  { label: 'Design system', value: 'design-system' },
]

function MoveToProjectDialog() {
  const [open, setOpen] = useState(true)

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger render={<Button variant="outline" />}>
        Move to project
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label="Move issue to project">
        <Command items={projects}>
          <CommandInput
            aria-label="Move issue to project"
            placeholder="Move to…"
          />
          <CommandPanel>
            <CommandEmpty>No project has that name.</CommandEmpty>
            <CommandList>
              {(project: CommandEntry) => (
                <CommandItem
                  key={project.value}
                  onClick={() => setOpen(false)}
                  value={project}
                >
                  {project.label}
                </CommandItem>
              )}
            </CommandList>
          </CommandPanel>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  )
}

export const MoveToProject: Story = {
  render: () => <MoveToProjectDialog />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Move issue to project',
    })
    await expect(within(dialog).getAllByRole('option')).toHaveLength(
      projects.length,
    )
    await expect(
      within(dialog).getByRole('option', { name: 'Billing migration' }),
    ).toBeVisible()
  },
}
