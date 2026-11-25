import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar12 } from '@tc96/ui/blocks/application/navbar/navbar-12'
import { useState } from 'react'
import { cta, items, logo, name } from '../fixtures/navbar-12.tsx'

const pages: Record<string, { text: string; title: string }> = {
  '/': {
    text: 'Reúna números, conversas e integrações em um só lugar.',
    title: 'Tudo o que seu time precisa',
  },
  '/cadastro': {
    text: 'Crie sua conta em menos de um minuto.',
    title: 'Comece agora',
  },
  '/precos': {
    text: 'Planos simples para equipes de qualquer tamanho.',
    title: 'Preços',
  },
  '/produto/analises': {
    text: 'Painéis que mostram o que mudou desde ontem.',
    title: 'Análises',
  },
  '/produto/seguranca': {
    text: 'Permissões por pessoa, por equipe e por projeto.',
    title: 'Segurança',
  },
}

const MarketingSite = () => {
  const [path, setPath] = useState('/')
  const page = pages[path] ?? pages['/']

  return (
    <div className="min-h-96">
      <Navbar12
        cta={cta}
        items={items}
        logo={logo}
        name={name}
        renderLink={(href) => (
          // biome-ignore lint/a11y/useAnchorContent: the render prop merges the link text into this element
          <a
            href={href}
            onClick={(event) => {
              event.preventDefault()
              setPath(href)
            }}
          />
        )}
      />
      <main className="grid gap-2 p-8">
        <h1 className="font-semibold text-2xl">{page.title}</h1>
        <p className="text-muted-foreground text-sm">{page.text}</p>
      </main>
    </div>
  )
}

const meta = {
  component: MarketingSite,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar12/Usages',
} satisfies Meta<typeof MarketingSite>

export default meta

type Story = StoryObj<typeof meta>

export const BrowsingTheProductMenu: Story = {}

export const GoingToPricingAndSigningUp: Story = {}

export const NavigatingFromTheMobileSheet: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
}
