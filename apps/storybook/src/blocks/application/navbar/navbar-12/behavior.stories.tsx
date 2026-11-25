import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar12 } from '@tc96/ui/blocks/application/navbar/navbar-12'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { cta, items, logo, name } from '../fixtures/navbar-12.tsx'
import {
  type Navbar12Controls,
  navbar12ControlArgs,
} from './navbar-12-controls.ts'
import {
  ComposedNavbar12,
  navbar12Handlers,
  renderRouterLink,
} from './navbar-12-layouts.tsx'

const meta = {
  args: navbar12ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar12Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar12 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar12/Behavior',
} satisfies Meta<Navbar12Controls>

export default meta

type Story = StoryObj<typeof meta>

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
  },
}

export const NavigationIsNamed: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('navigation', {
        name: 'Navegação principal',
      }),
    ).toBeVisible()
  },
}

export const BrandLinksToHomeThroughRenderLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const brand = canvas.getByRole('link', { name: 'Aurora' })
    await expect(brand).toHaveAttribute('href', '/')
    await expect(brand).toHaveAttribute('data-link', 'router')
    await userEvent.click(brand)
    await expect(navbar12Handlers.onNavigate).toHaveBeenCalledWith('/')
  },
}

export const BrandShowsTheLogoBesideTheName: Story = {
  play: async ({ canvasElement }) => {
    const brand = within(canvasElement).getByRole('link', { name: 'Aurora' })
    await expect(brand.querySelector('svg')).not.toBeNull()
  },
}

export const WithoutLogoOnlyTheNameRenders: Story = {
  args: { showLogo: false },
  play: async ({ canvasElement }) => {
    const brand = within(canvasElement).getByRole('link', { name: 'Aurora' })
    await expect(brand.querySelector('svg')).toBeNull()
  },
}

export const PlainItemIsALink: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Preços' })
    await expect(link).toHaveAttribute('href', '/precos')
    await expect(link).toHaveAttribute('data-link', 'router')
  },
}

export const WithoutPricingOnlyMenusRender: Story = {
  args: { showPricing: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link', { name: 'Preços' })).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Produto' })).toBeVisible()
  },
}

export const MenuTriggersAreClosedButtons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const label of ['Produto', 'Empresa']) {
      const trigger = canvas.getByRole('button', { name: label })
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await expect(trigger.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    }
    await expect(screen.queryByRole('dialog')).toBeNull()
  },
}

export const MenuOpensWithTwoColumnsOfLinks: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Produto',
    })
    await userEvent.click(trigger)
    const panel = await screen.findByRole('dialog', { name: 'Produto' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const columns = panel.querySelectorAll('[data-group]')
    await expect(columns).toHaveLength(2)
    await expect(within(panel).getAllByRole('link')).toHaveLength(4)
    await expect(panel.querySelector('.grid-cols-2')).not.toBeNull()
  },
}

export const MenuLinksShowIconTitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Produto' }),
    )
    const panel = await screen.findByRole('dialog', { name: 'Produto' })
    const link = within(panel).getByRole('link', { name: /Análises/ })
    await expect(link).toHaveAttribute('href', '/produto/analises')
    await expect(link).toHaveAttribute('data-link', 'router')
    await expect(link.querySelector('svg')).not.toBeNull()
    await waitFor(() =>
      expect(
        within(link).getByText('Acompanhe resultados em tempo real.'),
      ).toBeVisible(),
    )
    await expect(within(panel).getByText('Plataforma')).toBeVisible()
    await expect(within(panel).getByText('Confiança')).toBeVisible()
  },
}

export const SingleGroupMenuUsesOneColumn: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Empresa' }),
    )
    const panel = await screen.findByRole('dialog', { name: 'Empresa' })
    await expect(panel.querySelectorAll('[data-group]')).toHaveLength(1)
    await expect(panel.querySelector('.grid-cols-2')).toBeNull()
  },
}

export const SelectingALinkClosesTheMenu: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Produto' }),
    )
    const panel = await screen.findByRole('dialog', { name: 'Produto' })
    await userEvent.click(
      within(panel).getByRole('link', { name: /Segurança/ }),
    )
    await expect(navbar12Handlers.onNavigate).toHaveBeenCalledWith(
      '/produto/seguranca',
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EscapeClosesTheMenuAndReturnsFocus: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Produto',
    })
    await userEvent.click(trigger)
    await screen.findByRole('dialog', { name: 'Produto' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const EnterOpensTheMenuAndMovesFocusInside: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Empresa',
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const panel = await screen.findByRole('dialog', { name: 'Empresa' })
    await waitFor(() =>
      expect(panel).toContainElement(document.activeElement as HTMLElement),
    )
  },
}

export const SpaceOpensTheMenu: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Produto',
    })
    trigger.focus()
    await userEvent.keyboard(' ')
    const panel = await screen.findByRole('dialog', { name: 'Produto' })
    await waitFor(() => expect(panel).toBeVisible())
  },
}

export const OpeningAnotherMenuClosesTheFirst: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Produto' }))
    await screen.findByRole('dialog', { name: 'Produto' })
    await userEvent.click(canvas.getByRole('button', { name: 'Empresa' }))
    await screen.findByRole('dialog', { name: 'Empresa' })
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Produto' })).toBeNull(),
    )
    await expect(screen.getAllByRole('dialog')).toHaveLength(1)
  },
}

export const HoverDoesNotOpenTheMenuByDefault: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(
      within(canvasElement).getByRole('button', { name: 'Produto' }),
    )
    await new Promise((resolve) => setTimeout(resolve, 300))
    await expect(screen.queryByRole('dialog')).toBeNull()
  },
}

export const OpenOnHoverOpensTheMenuWithThePointer: Story = {
  args: { openOnHover: true },
  play: async ({ canvasElement }) => {
    await userEvent.hover(
      within(canvasElement).getByRole('button', { name: 'Produto' }),
    )
    const panel = await screen.findByRole('dialog', { name: 'Produto' })
    await waitFor(() => expect(panel).toBeVisible())
  },
}

export const CtaLinksThroughRenderLink: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Começar agora',
    })
    await expect(link).toHaveAttribute('href', '/cadastro')
    await expect(link).toHaveAttribute('data-link', 'router')
    await userEvent.click(link)
    await expect(navbar12Handlers.onNavigate).toHaveBeenCalledWith('/cadastro')
  },
}

export const CtaArrowSlidesOnHoverAndRespectsReducedMotion: Story = {
  play: async ({ canvasElement }) => {
    const arrow = within(canvasElement)
      .getByRole('link', { name: 'Começar agora' })
      .querySelector('svg')
    await expect(arrow).toHaveAttribute('aria-hidden', 'true')
    await expect(arrow).toHaveClass(
      'transition-transform',
      'group-hover:translate-x-1',
      'motion-reduce:transition-none',
      'motion-reduce:group-hover:translate-x-0',
    )
  },
}

export const WithoutCtaNoActionRenders: Story = {
  args: { showCta: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('link', { name: 'Começar agora' }),
    ).toBeNull()
  },
}

export const DesktopHidesTheMenuButton: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Abrir menu de navegação',
      }),
    ).toBeNull()
  },
}

export const MobileCollapsesTheNavIntoAMenuButton: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('navigation')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Produto' })).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Abrir menu de navegação' }),
    ).toBeVisible()
  },
}

export const MobileSheetGroupsTheSameLinks: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Abrir menu de navegação',
      }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'Menu' })
    const nav = within(sheet).getByRole('navigation', {
      name: 'Navegação principal',
    })
    await waitFor(() => expect(within(nav).getByText('Produto')).toBeVisible())
    await expect(within(nav).getByText('Empresa')).toBeVisible()
    await expect(within(nav).getByText('Plataforma')).toBeVisible()
    await expect(within(nav).getAllByRole('link')).toHaveLength(7)
    await expect(
      within(nav).getByRole('link', { name: /Carreiras/ }),
    ).toHaveAttribute('href', '/empresa/carreiras')
    await expect(
      within(nav).getByRole('link', { name: 'Preços' }),
    ).toHaveAttribute('href', '/precos')
  },
}

export const MobileSelectingALinkClosesTheSheet: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Abrir menu de navegação',
      }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'Menu' })
    await userEvent.click(within(sheet).getByRole('link', { name: 'Preços' }))
    await expect(navbar12Handlers.onNavigate).toHaveBeenCalledWith('/precos')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const MobileEscapeClosesTheSheetAndReturnsFocus: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Abrir menu de navegação',
    })
    await userEvent.click(button)
    await screen.findByRole('dialog', { name: 'Menu' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const MobileSheetCloseButtonUsesTheLabel: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Abrir menu de navegação',
      }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'Menu' })
    await userEvent.click(
      within(sheet).getByRole('button', { name: 'Fechar menu' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const DefaultRenderLinkIsAPlainAnchor: Story = {
  render: () => <Navbar12 cta={cta} items={items} logo={logo} name={name} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Preços' }),
    ).not.toHaveAttribute('data-link')
    await expect(canvas.getByRole('link', { name: 'Aurora' })).toHaveAttribute(
      'href',
      '/',
    )
  },
}

export const HomeHrefOverridesTheBrandLink: Story = {
  render: () => (
    <Navbar12
      homeHref="/inicio"
      items={items}
      name={name}
      renderLink={renderRouterLink}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Aurora' }),
    ).toHaveAttribute('href', '/inicio')
  },
}

export const LabelsOverrideTexts: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  render: () => (
    <Navbar12
      items={items}
      labels={{
        closeMenu: 'Close the menu',
        menuTitle: 'Navegar',
        navigation: 'Site',
        openMenu: 'Open the menu',
      }}
      name={name}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open the menu' }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'Navegar' })
    await waitFor(() =>
      expect(
        within(sheet).getByRole('navigation', { name: 'Site' }),
      ).toBeVisible(),
    )
    await expect(
      within(sheet).getByRole('button', { name: 'Close the menu' }),
    ).toBeVisible()
  },
}
