import type { Meta, StoryObj } from '@storybook/react-vite'
import type { RichTextEditor2Settings } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-2'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { useState } from 'react'
import { people, playbook } from '../fixtures/rich-text-editor-2.ts'
import { WikiPage } from './rich-text-editor-2-layouts.tsx'

const PlaybookPage = ({
  defaultSettings,
}: Readonly<{ defaultSettings?: Partial<RichTextEditor2Settings> }>) => {
  const [versions, setVersions] = useState(0)
  const [blocks, setBlocks] = useState(playbook.length)

  const save = (value: RichTextValue) => {
    setVersions((count) => count + 1)
    setBlocks(value.length)
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 p-6">
      <WikiPage
        defaultSettings={defaultSettings}
        defaultValue={playbook}
        onSave={save}
        people={people}
        saveDelay={200}
      />
      <output className="text-muted-foreground text-sm">
        {versions === 0
          ? 'Nenhuma versão gravada ainda.'
          : `Versão ${versions} gravada com ${blocks} blocos.`}
      </output>
    </main>
  )
}

const meta = {
  component: PlaybookPage,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor2/Usages',
} satisfies Meta<typeof PlaybookPage>

export default meta

type Story = StoryObj<typeof meta>

export const EditingTheEscalationPlaybook: Story = {}

export const LockedCopyForReview: Story = {
  args: { defaultSettings: { locked: true } },
}
