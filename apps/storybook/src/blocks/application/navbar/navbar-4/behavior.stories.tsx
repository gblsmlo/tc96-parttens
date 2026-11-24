import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar4 } from '@tc96/ui/blocks/application/navbar/navbar-4'
import { expect, userEvent, within } from 'storybook/test'
import {
  type Navbar4Controls,
  navbar4ControlArgs,
} from './navbar-4-controls.ts'
import { ComposedNavbar4, navbar4Handlers } from './navbar-4-layouts.tsx'

const meta = {
  args: navbar4ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar4Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar4/Behavior',
} satisfies Meta<Navbar4Controls>

export default meta

type Story = StoryObj<typeof meta>

export const TitleAndSavedTextShow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Fluxo de boas-vindas' }),
    ).toBeVisible()
    await expect(canvas.getByText('Salvo há 2 minutos')).toBeVisible()
  },
}

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header.tagName).toBe('HEADER')
    await expect(header).toHaveClass('border-b', 'w-full')
  },
}

export const CloseNeedsOnClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Fechar editor' }))
    await expect(navbar4Handlers.onClose).toHaveBeenCalledTimes(1)
  },
}

export const WithoutCallbacksNoActionRenders: Story = {
  render: () => <Navbar4 title="Fluxo de boas-vindas" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('button')).toHaveLength(0)
    await expect(canvas.queryByRole('switch')).toBeNull()
  },
}

export const SavedTextIsOptional: Story = {
  args: { savedText: '' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="navbar-saved"]'),
    ).toBeNull()
  },
}

export const SwitchIsControlled: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Ativo' })
    await expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
  },
}

export const TestAndHistoryCallTheirHandlers: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Testar' }))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Histórico de versões' }),
    )
    await expect(navbar4Handlers.onTest).toHaveBeenCalledTimes(1)
    await expect(navbar4Handlers.onHistory).toHaveBeenCalledTimes(1)
  },
}

export const SubmitCallsOnSubmit: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Salvar' }),
    )
    await expect(navbar4Handlers.onSubmit).toHaveBeenCalledTimes(1)
  },
}

export const PendingDisablesTestAndSubmit: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Testar' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar4
      active
      labels={{ active: 'Em produção', close: 'Sair', submit: 'Publicar' }}
      onActiveChange={() => undefined}
      onClose={() => undefined}
      onSubmit={() => undefined}
      title="Fluxo"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('switch', { name: 'Em produção' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Sair' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Publicar' })).toBeVisible()
  },
}
