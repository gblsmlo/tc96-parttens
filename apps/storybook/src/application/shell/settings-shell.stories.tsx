import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { SettingsShell } from '@tc96/templates/application/shell/settings-shell'
import { Input } from '@tc96/ui/input'
import { Switch } from '@tc96/ui/switch'
import type { ReactElement } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { settingsBreadcrumbs, settingsNavigation } from './fixtures/shell-data'

function ProfileSettingsPage(): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <h1 className="font-semibold text-lg">Perfil</h1>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Informações pessoais</SettingsSectionTitle>
            <SettingsSectionDescription>
              Como a equipe vê você no workspace.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          endSlot={
            <Input
              aria-label="Nome"
              className="w-56"
              defaultValue="Marina Costa"
            />
          }
          title="Nome"
        />
        <SettingsRow
          description="Exibe seu e-mail no perfil público"
          endSlot={<Switch aria-label="Mostrar e-mail" defaultChecked />}
          title="Mostrar e-mail"
        />
      </SettingsSection>
    </div>
  )
}

const usage = `
// npx @tc96/parttens add settings-shell
import { SettingsShell } from '@acme/templates/application/shell/settings-shell'
import { Link } from '@tanstack/react-router'

<SettingsShell
  backHref="/"
  breadcrumbs={[{ href: '/settings', label: 'Configurações' }, { label: 'Perfil' }]}
  navigation={settingsNavigation}
  renderLink={(href) => <Link to={href} />}
>
  <Outlet />
</SettingsShell>
`

const docs = {
  api: [
    {
      description:
        'Root component, the layout of the settings routes. The COSS `SidebarProvider` with a `Sidebar` that slides off canvas (`collapsible="offcanvas"`) and a `SidebarRail`, beside a `SidebarInset` that holds the header and `children`. Open state is uncontrolled through `defaultOpen` or controlled through `open` and `onOpenChange`.',
      name: 'SettingsShell',
    },
    {
      description:
        'The control at the top of the sidebar, named by `labels.backToApp`. Pass exactly one: `backHref` renders a link through `renderLink`, `onBack` renders a button that calls it.',
      name: 'backHref | onBack',
    },
    {
      description:
        '`ShellNavGroup[]`, the same shape as the app shells. The groups render inside one `nav` named by `labels.settingsNavigation`; `active` sets `aria-current="page"`, and `badge`, `actions` and nested `items` behave as in `AppShell1`.',
      name: 'navigation',
    },
    {
      description:
        '`breadcrumbs` renders the COSS `Breadcrumb` after the sidebar trigger; `actions` sits at the end of the header.',
      name: 'breadcrumbs',
    },
    {
      description:
        '`(href) => ReactElement`. The back link, the navigation and the breadcrumb render through it; the default is a plain `a`.',
      name: 'renderLink',
    },
    {
      description:
        'Partial `ShellLabels`. Every visible or accessible text the template owns, with pt-BR defaults.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'The sidebar level for settings or account pages: a back control to the app at the top, the settings menu below it, and a header with the sidebar trigger and the breadcrumb. Mount it as the layout of the settings routes, next to the app shell. Install it with `npx @tc96/parttens add settings-shell`.',
  },
  story: { height: '42rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    backHref: '/',
    breadcrumbs: settingsBreadcrumbs,
    children: <ProfileSettingsPage />,
    navigation: settingsNavigation,
  },
  component: SettingsShell,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Application/Shell/SettingsShell',
} satisfies Meta<typeof SettingsShell>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Voltar ao app' }),
    ).toHaveAttribute('href', '/')
    const navigation = canvas.getByRole('navigation', {
      name: 'Navegação de configurações',
    })
    await expect(
      within(navigation).getByRole('link', { name: 'Perfil' }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      within(navigation).getByRole('list', { name: 'Workspace' }),
    ).toBeVisible()
  },
}

export const BackButton: Story = {
  args: { backHref: undefined, onBack: fn() },
  parameters: {
    docs: {
      description: {
        story:
          'With `onBack` instead of `backHref`, the back control is a button and the app decides where to go.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('link', { name: 'Voltar ao app' }),
    ).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Voltar ao app' }))
    await expect(args.onBack).toHaveBeenCalledOnce()
  },
}

export const Collapsed: Story = {
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvasElement.querySelector('[data-slot="sidebar"]')
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await expect(sidebar).toHaveAttribute('data-collapsible', 'offcanvas')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alternar barra lateral' }),
    )
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  },
  tags: interaction,
}

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('navigation', { name: 'Navegação de configurações' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alternar barra lateral' }),
    )
    const sheet = await within(document.body).findByRole('dialog')
    await waitFor(() =>
      expect(
        within(sheet).getByRole('link', { name: 'Voltar ao app' }),
      ).toBeVisible(),
    )
  },
}
