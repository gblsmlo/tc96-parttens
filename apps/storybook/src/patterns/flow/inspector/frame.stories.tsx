import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowInspector } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const mobile = { viewport: { isRotated: false, value: 'mobile2' } }

const meta = {
  args: {
    build: <p>Conteúdo do build</p>,
    children: <button type="button">Salvar passo</button>,
    logs: <p>Conteúdo dos logs</p>,
    onClose: fn(),
    onTabChange: fn(),
    open: true,
    status: <p>Conteúdo do status</p>,
    tab: 'build',
    title: 'Enviar mensagem',
  },
  component: FlowInspector,
  decorators: [
    (Story) => (
      <div className="flex h-160 justify-end overflow-hidden rounded-lg border">
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Frame',
} satisfies Meta<typeof FlowInspector>

export default meta
type Story = StoryObj<typeof meta>

export const DocksNamedAside: Story = {
  play: async ({ canvasElement }) => {
    const aside = within(canvasElement).getByRole('complementary', {
      name: 'Detalhes do passo',
    })
    await expect(aside).toHaveAttribute('data-docked', 'true')
    await expect(aside).not.toHaveAttribute('inert')
    await expect(aside.style.getPropertyValue('--flow-inspector-width')).toBe(
      '24rem',
    )
  },
}

export const ClosedAsideIsInert: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    const aside = canvasElement.querySelector('aside') as HTMLElement
    await expect(aside).toHaveAttribute('data-docked', 'false')
    await expect(aside).toHaveAttribute('inert')
    await expect(aside.className).toContain('w-0')
  },
}

export const WidthFromProp: Story = {
  args: { width: '30rem' },
  play: async ({ canvasElement }) => {
    const aside = within(canvasElement).getByRole('complementary', {
      name: 'Detalhes do passo',
    })
    await expect(aside.style.getPropertyValue('--flow-inspector-width')).toBe(
      '30rem',
    )
  },
}

export const HeaderPanelAndFooter: Story = {
  args: {
    badge: 'Ação · send',
    icon: <svg aria-hidden="true" data-testid="icon" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Enviar mensagem' }),
    ).toBeVisible()
    await expect(canvas.getByText('Ação · send')).toBeVisible()
    await expect(canvas.getByTestId('icon')).toBeInTheDocument()
    await expect(canvas.getByText('Conteúdo do build')).toBeVisible()
    await expect(canvas.queryByText('Conteúdo dos logs')).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Salvar passo' }),
    ).toBeVisible()
  },
}

export const CloseButtonCallsOnClose: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Fechar detalhes do passo',
      }),
    )
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const TabsReportChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('tab').map((tab) => tab.textContent),
    ).toEqual(['Build', 'Status', 'Logs'])
    await expect(canvas.getByRole('tab', { name: 'Build' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.click(canvas.getByRole('tab', { name: 'Status' }))
    await expect(args.onTabChange).toHaveBeenCalledWith('status')
  },
}

export const ControlledTabPanel: Story = {
  args: { tab: 'logs' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Conteúdo dos logs')).toBeVisible()
    await expect(canvas.queryByText('Conteúdo do build')).toBeNull()
  },
}

export const DisabledTabsDoNotReport: Story = {
  args: { disabledTabs: ['status', 'logs'] },
  play: async ({ args, canvasElement }) => {
    const status = within(canvasElement).getByRole('tab', { name: 'Status' })
    await expect(status).toHaveAttribute('aria-disabled', 'true')
    status.click()
    await expect(args.onTabChange).not.toHaveBeenCalled()
  },
}

export const UnconnectedAlertInBuild: Story = {
  args: { unconnected: true },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(
      within(alert).getByText('Nada chega a este passo.'),
    ).toBeVisible()
    await expect(
      within(alert).getByText('Conecte um passo a este.'),
    ).toBeVisible()
  },
}

export const UnconnectedAlertHiddenOutsideBuild: Story = {
  args: { tab: 'status', unconnected: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('alert')).toBeNull()
  },
}

export const FooterOmittedWithoutChildren: Story = {
  args: { children: undefined, title: 'Passo' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="flow-inspector-footer"]'),
    ).toBeNull()
  },
}

export const LabelsFromProp: Story = {
  args: {
    labels: { close: 'Close step details', title: 'Step details' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('complementary', { name: 'Step details' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Close step details' }),
    ).toBeVisible()
  },
}

export const SheetBelowMd: Story = {
  decorators: [],
  globals: mobile,
  parameters: { layout: 'fullscreen' },
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Detalhes do passo',
    })
    await expect(document.querySelector('aside')).toBeNull()
    await expect(within(dialog).getByText('Conteúdo do build')).toBeVisible()
    await expect(within(dialog).getAllByRole('tab')).toHaveLength(3)
    await expect(
      within(dialog).getByRole('button', { name: 'Salvar passo' }),
    ).toBeVisible()
  },
}

export const ClosedBelowMdRendersNothing: Story = {
  args: { open: false },
  decorators: [],
  globals: mobile,
  parameters: { layout: 'fullscreen' },
  play: async () => {
    await expect(screen.queryByRole('dialog')).toBeNull()
    await expect(document.querySelector('aside')).toBeNull()
  },
}

export const SheetEscapeCallsOnClose: Story = {
  decorators: [],
  globals: mobile,
  parameters: { layout: 'fullscreen' },
  play: async ({ args }) => {
    await screen.findByRole('dialog', { name: 'Detalhes do passo' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  },
}
