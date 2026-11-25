import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar11 } from '@tc96/ui/blocks/application/navbar/navbar-11'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { brandName, sections, sources, user } from '../fixtures/navbar-11.ts'
import {
  type Navbar11Controls,
  navbar11ControlArgs,
} from './navbar-11-controls.ts'
import { ComposedNavbar11, navbar11Handlers } from './navbar-11-layouts.tsx'

const meta = {
  args: navbar11ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar11Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar11 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar11/Behavior',
} satisfies Meta<Navbar11Controls>

export default meta

type Story = StoryObj<typeof meta>

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
  },
}

export const BrandShowsNameAndVersion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(brandName)).toBeVisible()
    await expect(canvas.getByText('v2.4.0')).toHaveAttribute(
      'data-slot',
      'navbar-version',
    )
  },
}

export const WithoutVersionNoBadgeRenders: Story = {
  args: { showVersion: false },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="navbar-version"]'),
    ).toBeNull()
  },
}

export const SectionsAreANamedTabList: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('tablist', {
      name: 'Seções do sistema de design',
    })
    await expect(within(list).getAllByRole('tab')).toHaveLength(sections.length)
    await expect(canvas.getByRole('tab', { name: 'Tokens' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('tab', { name: 'Ícones' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  },
}

export const ClickingATabCallsOnSectionChangeWithItsId: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('tab', { name: 'Ícones' }),
    )
    await expect(navbar11Handlers.onSectionChange).toHaveBeenCalledWith('icons')
  },
}

export const ArrowKeysMoveBetweenTabs: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('tab', { name: 'Tokens' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Ícones' })).toHaveFocus()
  },
}

export const SectionIsControlled: Story = {
  args: { section: 'motion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('tab', { name: 'Movimento' }),
    ).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(canvas.getByRole('tab', { name: 'Padrões' }))
    await expect(
      canvas.getByRole('tab', { name: 'Movimento' }),
    ).toHaveAttribute('aria-selected', 'true')
  },
}

export const WithoutSectionsNoTabsRender: Story = {
  args: { showSections: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('tablist')).toBeNull()
  },
}

export const SourceTriggerNamesTheCurrentSource: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Fonte de sincronização: Tokens do shadcn/ui',
    })
    await expect(trigger).toHaveTextContent('Tokens do shadcn/ui')
  },
}

export const SourceMenuChecksTheCurrentSource: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: /Fonte de sincronização/,
      }),
    )
    const items = await screen.findAllByRole('menuitemradio')
    await expect(items).toHaveLength(sources.length)
    await expect(
      screen.getByRole('menuitemradio', { name: 'Tokens do shadcn/ui' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemradio', { name: 'Variáveis do Figma' }),
    ).toHaveAttribute('aria-checked', 'false')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ChoosingASourceCallsOnSourceChangeAndCloses: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: /Fonte de sincronização/,
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Variáveis do Figma' }),
    )
    await expect(navbar11Handlers.onSourceChange).toHaveBeenCalledWith('figma')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const SourceMenuOpensFromTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement)
      .getByRole('button', { name: /Fonte de sincronização/ })
      .focus()
    await userEvent.keyboard('{Enter}')
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Repositório do tema' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutSourcesNoSwitcherRenders: Story = {
  args: { showSources: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: /Fonte de sincronização/,
      }),
    ).toBeNull()
  },
}

export const AccountMenuShowsTheUserAndItsItems: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('GM')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Menu da conta' }))
    await expect(await screen.findByText(user.name)).toBeVisible()
    await expect(screen.getByText(user.email ?? '')).toBeVisible()
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(3)
  },
}

export const AccountMenuItemCallsItsHandlerAndCloses: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Menu da conta' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Configurações' }),
    )
    await expect(navbar11Handlers.onUserAction).toHaveBeenCalledWith('settings')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutMenuTheAccountListsOnlyTheUser: Story = {
  args: { showMenu: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Menu da conta' }),
    )
    await expect(await screen.findByText(user.name)).toBeVisible()
    await expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutUserNoAccountMenuRenders: Story = {
  args: { showUser: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Menu da conta' }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar11
      labels={{
        account: 'Minha conta',
        sectionNavigation: 'Áreas',
        sourceTrigger: (source) => `Sincronizar com ${source}`,
      }}
      name={brandName}
      onSectionChange={() => undefined}
      onSourceChange={() => undefined}
      section="tokens"
      sections={sections}
      source="figma"
      sources={sources}
      user={user}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tablist', { name: 'Áreas' })).toBeVisible()
    await expect(
      canvas.getByRole('button', {
        name: 'Sincronizar com Variáveis do Figma',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Minha conta' }),
    ).toBeVisible()
  },
}
