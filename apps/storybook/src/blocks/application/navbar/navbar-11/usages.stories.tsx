import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar11 } from '@tc96/ui/blocks/application/navbar/navbar-11'
import { useState } from 'react'
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

export const BrowsingTheSections: Story = {}

export const SwitchingTheSyncSource: Story = {}

export const RunningAnAccountAction: Story = {}
