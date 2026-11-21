import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { expect, within } from 'storybook/test'
import { inactiveTabContrast, TabsCanvas } from './tabs-frame.tsx'

const installCommands = [
  { command: 'npm install @acme/charts', label: 'npm', value: 'npm' },
  { command: 'pnpm add @acme/charts', label: 'pnpm', value: 'pnpm' },
  { command: 'bun add @acme/charts', label: 'bun', value: 'bun' },
]

const projectSections = [
  {
    label: 'Overview',
    text: 'Deployed to production 2 hours ago from main.',
    value: 'overview',
  },
  {
    label: 'Deployments',
    text: '148 deployments in the last 30 days.',
    value: 'deployments',
  },
  {
    label: 'Analytics',
    text: '12,480 visitors this week, up 8% from last week.',
    value: 'analytics',
  },
  {
    label: 'Settings',
    text: 'Domains, environment variables and build options.',
    value: 'settings',
  },
]

const workspaceSections = [
  {
    label: 'General',
    text: 'Workspace name, URL and default language.',
    value: 'general',
  },
  {
    label: 'Members',
    text: '14 members and 3 pending invitations.',
    value: 'members',
  },
  {
    label: 'Billing',
    text: 'Team plan, billed yearly. Next invoice on March 1.',
    value: 'billing',
  },
  {
    label: 'Security',
    text: 'Two-factor authentication is required for every member.',
    value: 'security',
  },
]

const meta = {
  decorators: [TabsCanvas],
  parameters: { ...inactiveTabContrast, layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Tabs/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AccountSettings: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTab value="account">Account</TabsTab>
        <TabsTab value="password">Password</TabsTab>
        <TabsTab value="notifications">Notifications</TabsTab>
      </TabsList>
      <TabsPanel className="flex flex-col gap-1 text-sm" value="account">
        <p className="font-medium">Ana Souza</p>
        <p className="text-muted-foreground">ana.souza@example.com</p>
      </TabsPanel>
      <TabsPanel className="text-muted-foreground text-sm" value="password">
        Last changed 3 months ago.
      </TabsPanel>
      <TabsPanel
        className="text-muted-foreground text-sm"
        value="notifications"
      >
        Email for mentions and replies; weekly digest on Mondays.
      </TabsPanel>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('tab')).toHaveLength(3)
    await expect(canvas.getByText('ana.souza@example.com')).toBeVisible()
  },
}

export const InstallCommand: Story = {
  render: () => (
    <Tabs defaultValue="npm">
      <TabsList size="sm">
        {installCommands.map(({ label, value }) => (
          <TabsTab key={value} value={value}>
            {label}
          </TabsTab>
        ))}
      </TabsList>
      {installCommands.map(({ command, value }) => (
        <TabsPanel key={value} value={value}>
          <pre className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
            <code>{command}</code>
          </pre>
        </TabsPanel>
      ))}
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('npm install @acme/charts'),
    ).toBeVisible()
  },
}

export const ProjectHeader: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <div className="border-b">
        <TabsList variant="underline">
          {projectSections.map(({ label, value }) => (
            <TabsTab key={value} value={value}>
              {label}
            </TabsTab>
          ))}
        </TabsList>
      </div>
      {projectSections.map(({ text, value }) => (
        <TabsPanel
          className="text-muted-foreground text-sm"
          key={value}
          value={value}
        >
          {text}
        </TabsPanel>
      ))}
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(
      canvas.getByText('Deployed to production 2 hours ago from main.'),
    ).toBeVisible()
  },
}

export const WorkspaceSettings: Story = {
  render: () => (
    <Tabs className="w-full" defaultValue="members" orientation="vertical">
      <div className="border-s">
        <TabsList variant="underline">
          {workspaceSections.map(({ label, value }) => (
            <TabsTab key={value} value={value}>
              {label}
            </TabsTab>
          ))}
        </TabsList>
      </div>
      {workspaceSections.map(({ text, value }) => (
        <TabsPanel
          className="px-2 py-1 text-muted-foreground text-sm"
          key={value}
          value={value}
        >
          {text}
        </TabsPanel>
      ))}
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tab', { name: 'Members' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(
      canvas.getByText('14 members and 3 pending invitations.'),
    ).toBeVisible()
  },
}
