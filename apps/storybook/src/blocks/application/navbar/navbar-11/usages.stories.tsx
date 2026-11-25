import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar11 } from '@tc96/ui/blocks/application/navbar/navbar-11'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  brandName,
  sections,
  sources,
  user,
  version,
} from '../fixtures/navbar-11.ts'
import { brandMark, renderUserMenu } from './navbar-11-layouts.tsx'

const DesignSystemPage = () => {
  const [section, setSection] = useState('patterns')
  const [source, setSource] = useState('shadcn')
  const [lastAction, setLastAction] = useState('Nenhuma ação executada.')
  const sectionLabel = sections.find((item) => item.id === section)?.label
  const sourceLabel = sources.find((item) => item.id === source)?.label

  return (
    <div className="min-h-64">
      <Navbar11
        logo={brandMark}
        menu={renderUserMenu((id) => setLastAction(`Ação: ${id}`))}
        name={brandName}
        onSectionChange={setSection}
        onSourceChange={setSource}
        section={section}
        sections={sections}
        source={source}
        sources={sources}
        user={user}
        version={version}
      />
      <main className="flex flex-col gap-1 p-6 text-sm">
        <h1 className="font-semibold text-lg">{sectionLabel}</h1>
        <p className="text-muted-foreground">Sincronizado com {sourceLabel}.</p>
        <p className="text-muted-foreground">{lastAction}</p>
      </main>
    </div>
  )
}

const meta = {
  component: DesignSystemPage,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar11/Usages',
} satisfies Meta<typeof DesignSystemPage>

export default meta

type Story = StoryObj<typeof meta>

export const BrowsingTheSections: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Padrões' })).toBeVisible()
    await userEvent.click(canvas.getByRole('tab', { name: 'Movimento' }))
    await expect(
      canvas.getByRole('heading', { name: 'Movimento' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('tab', { name: 'Movimento' }),
    ).toHaveAttribute('aria-selected', 'true')
  },
}

export const SwitchingTheSyncSource: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Sincronizado com Tokens do shadcn/ui.'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: /Fonte de sincronização/ }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Repositório do tema' }),
    )
    await expect(
      canvas.getByText('Sincronizado com Repositório do tema.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', {
        name: 'Fonte de sincronização: Repositório do tema',
      }),
    ).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const RunningAnAccountAction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Menu da conta' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Meu perfil' }),
    )
    await expect(canvas.getByText('Ação: profile')).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
