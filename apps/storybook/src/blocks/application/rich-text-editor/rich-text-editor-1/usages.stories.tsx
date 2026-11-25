import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor1 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-1'
import { Button } from '@tc96/ui/button'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { richTextTyping } from '../../../../test-utils/rich-text-typing.ts'
import {
  launchBrief,
  launchBriefDescription,
  launchBriefStatus,
  launchBriefTitle,
} from '../fixtures/rich-text-editor-1.ts'

const { focusEditor } = richTextTyping('Conteúdo do documento')

const AutosavedBrief = () => {
  const [saves, setSaves] = useState(0)
  const [lastSaved, setLastSaved] = useState<RichTextValue>(launchBrief)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 p-6">
      <RichTextEditor1
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
      <RichTextEditor1
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
      <RichTextEditor1
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum salvamento ainda.')).toBeVisible()
    await focusEditor(canvasElement)
    await userEvent.keyboard(' Fim.')
    await waitFor(() =>
      expect(
        canvas.getByText('1 salvamento enviado ao servidor.'),
      ).toBeVisible(),
    )
  },
}

export const ReviewingInViewOnlyMode: Story = {
  render: () => <ReviewedBrief />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('document', { name: 'Conteúdo do documento' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Pedir edição' }))
    await waitFor(() =>
      expect(
        canvas.getByRole('textbox', { name: 'Conteúdo do documento' }),
      ).toBeVisible(),
    )
    await expect(canvas.getByRole('toolbar')).toBeVisible()
  },
}

export const CopyingToTheClipboard: Story = {
  render: () => <ClipboardBrief />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Menu do documento' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar como texto' }),
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="copied-content"]'),
      ).toHaveTextContent('Agendar os e-mails de convite'),
    )
  },
}
