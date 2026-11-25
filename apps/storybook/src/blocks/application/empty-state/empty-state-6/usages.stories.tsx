import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState6 } from '@tc96/ui/blocks/application/empty-state/empty-state-6'
import { useState } from 'react'
import { tabs } from '../fixtures/empty-state-6.ts'

const AccountSetup = () => {
  const [tab, setTab] = useState('notifications')
  const [started, setStarted] = useState<string | null>(null)

  return (
    <div className="grid gap-3">
      <EmptyState6
        onSetup={setStarted}
        onTabChange={setTab}
        tab={tab}
        tabs={tabs}
      />
      {started ? (
        <output className="block text-center text-muted-foreground text-sm">
          {tabs.find((item) => item.id === started)?.actionLabel}
        </output>
      ) : null}
    </div>
  )
}

const meta = {
  component: AccountSetup,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState6/Usages',
} satisfies Meta<typeof AccountSetup>

export default meta

type Story = StoryObj<typeof meta>

export const NewAccountSettings: Story = {}
