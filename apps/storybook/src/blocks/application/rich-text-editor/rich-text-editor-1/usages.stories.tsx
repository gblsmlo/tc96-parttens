import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { useState } from 'react'
import { richTextTyping } from '../../../../test-utils/rich-text-typing.ts'
import {
  launchBrief,
  launchBriefDescription,
  launchBriefStatus,
  launchBriefTitle,
} from '../fixtures/rich-text-editor-1.ts'
import { DocumentPage } from './rich-text-editor-1-layouts.tsx'

const { focusEditor } = richTextTyping('Conteúdo do documento')

const AutosavedBrief = () => {
  const [saves, setSaves] = useState(0)
  const [lastSaved, setLastSaved] = useState<RichTextValue>(launchBrief)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 p-6">
      <DocumentPage
        defaultTitle={launchBriefTitle}
        defaultValue={launchBrief}
        description={launchBriefDescription}
        onSave={(value) => {
          setLastSaved(value)
          setSaves((count) => count + 1)
        }}
        saveDelay={300}
        status={launchBriefStatus}
      />
      <p
        className="text-muted-foreground text-sm"
        data-last-saved-blocks={lastSaved.length}
      >
        {saves === 0
          ? 'Nenhum salvamento ainda.'
          : `${saves} ${saves === 1 ? 'salvamento enviado' : 'salvamentos enviados'} ao servidor.`}
      </p>
    </div>
  )
}

const ReviewedBrief = () => {
  const [readOnly, setReadOnly] = useState(true)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 p-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setReadOnly((current) => !current)}
          size="sm"
          variant="outline"
        >
          {readOnly ? 'Pedir edição' : 'Concluir revisão'}
        </Button>
      </div>
      <DocumentPage
        defaultTitle={launchBriefTitle}
        defaultValue={launchBrief}
        onReadOnlyChange={setReadOnly}
        readOnly={readOnly}
        status={readOnly ? 'Somente leitura' : 'Em edição'}
      />
    </div>
  )
}

const ClipboardBrief = () => {
  const [copied, setCopied] = useState('')

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 p-6">
      <DocumentPage
        defaultTitle={launchBriefTitle}
        defaultValue={launchBrief}
        onCopy={(_format, content) => setCopied(content)}
      />
      <p
        data-slot="copied-content"
        className="max-h-32 whitespace-pre-wrap break-words line-clamp-4 rounded-lg border bg-muted/40 p-3 text-xs"
      >
        {copied || 'Nada copiado ainda.'}
      </p>
    </div>
  )
}

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor1/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AutosavingTheBrief: Story = {
  render: () => <AutosavedBrief />,
}

export const ReviewingInViewOnlyMode: Story = {
  render: () => <ReviewedBrief />,
}

export const CopyingToTheClipboard: Story = {
  render: () => <ClipboardBrief />,
}
