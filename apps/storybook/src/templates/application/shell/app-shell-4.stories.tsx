import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell4 } from '@tc96/templates/application/shell/app-shell-4'
import { type ReactElement, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import {
  ShellHeaderActions,
  ShellPagePlaceholder,
  shellBreadcrumbs,
  shellNotifications,
  shellSections,
  shellUser,
  shellUserActions,
  shellWorkspaces,
} from './fixtures/shell-data'

const usage = `
// npx @tc96/parttens add app-shell-4
import { AppShell4 } from '@acme/templates/application/shell/app-shell-4'

<AppShell4
  actions={<Button size="sm">Criar</Button>}
  notifications={notifications}
  onNavigate={(href) => navigate({ to: href })}
  onSectionChange={setSectionId}
  renderLink={(href) => <Link to={href} />}
  sectionId={sectionId}
  sections={[
    { icon: <BriefcaseIcon />, id: 'sales', navigation: salesNavigation, title: 'Vendas' },
    { icon: <MegaphoneIcon />, id: 'marketing', navigation: marketingNavigation, title: 'Marketing' },
  ]}
  user={user}
  workspaceId={workspaceId}
  workspaces={workspaces}
>
  <Outlet />
</AppShell4>
`

const docs = {
  api: [
    {
      description:
        'Root component. Two COSS `Sidebar`s with `collapsible="none"` inside one `Sidebar` with `collapsible="icon"`: an icon rail with the workspace switcher, the sections and the account menu, and the navigation of the active section. Collapsing leaves only the rail; picking a section opens the sidebar again. Takes the props of `AppShell1` except `navigation`.',
      name: 'AppShell4',
    },
    {
      description:
        '`ShellSection[]` (`id`, `title`, `icon`, `navigation`), with `sectionId` and `onSectionChange`. The rail is a `nav` named by `labels.sections`; each section is a button with `aria-pressed` and a tooltip. The panel shows the `title` as a heading and the section `navigation` in a `nav` named by that title. The section is controlled: keep it in the URL or in state.',
      name: 'sections',
    },
    {
      description:
        'The header holds the ⌘K search over every section (as in `AppShell2`, with `onNavigate`), the notifications popover (as in `AppShell3`) and then `actions`, the place for a Create button.',
      name: 'Header',
    },
  ],
  description: {
    component:
      'An application shell with an icon rail of sections and a navigation panel per section, plus a header with ⌘K search, notifications and a Create action. It is the shell of the Verve CRM mapping. Install it with `npx @tc96/parttens add app-shell-4`.',
  },
  story: { height: '42rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function ControlledSection(
  args: Parameters<typeof AppShell4>[0],
): ReactElement {
  const [sectionId, setSectionId] = useState(args.sectionId)
  return (
    <AppShell4
      {...args}
      onSectionChange={(next) => {
        args.onSectionChange?.(next)
        setSectionId(next)
      }}
      sectionId={sectionId}
    />
  )
}

const meta = {
  args: {
    actions: <ShellHeaderActions />,
    breadcrumbs: shellBreadcrumbs,
    children: <ShellPagePlaceholder />,
    notifications: shellNotifications,
    onMarkAllRead: fn(),
    onNavigate: fn(),
    onSectionChange: fn(),
    onSignOut: fn(),
    onWorkspaceChange: fn(),
    sectionId: 'sales',
    sections: shellSections,
    user: shellUser,
    userActions: shellUserActions,
    workspaceId: 'risine',
    workspaces: shellWorkspaces,
  },
  component: AppShell4,
  parameters: { docs, layout: 'fullscreen' },
  render: (args) => <ControlledSection key={args.sectionId} {...args} />,
  title: 'Templates/Application/Shell/AppShell4',
} satisfies Meta<typeof AppShell4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rail = canvas.getByRole('navigation', { name: 'Seções' })
    await expect(
      within(rail).getByRole('button', { name: 'Vendas' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      canvas.getByRole('navigation', { name: 'Vendas' }),
    ).toBeVisible()
  },
}

export const Collapsed: Story = {
  args: { defaultOpen: false },
}

export const SwitchSection: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const rail = canvas.getByRole('navigation', { name: 'Seções' })
    await userEvent.click(
      within(rail).getByRole('button', { name: 'Marketing' }),
    )
    await expect(args.onSectionChange).toHaveBeenCalledWith('marketing')
    const section = await canvas.findByRole('navigation', { name: 'Marketing' })
    await expect(
      within(section).getByRole('link', { name: 'Campanhas' }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      canvas.queryByRole('navigation', { name: 'Vendas' }),
    ).toBeNull()
  },
  tags: ['!autodocs'],
}
