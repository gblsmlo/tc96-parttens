import type { Meta, StoryObj } from '@storybook/react-vite'
import type { RichTextEditor2Settings } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-2'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { placeCaretAtEnd } from '../../../../test-utils/rich-text-typing.ts'
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

export const EditingTheEscalationPlaybook: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhuma versão gravada ainda.'),
    ).toBeVisible()
    const editor = canvas.getByRole('textbox', { name: 'Conteúdo da página' })
    const last = Array.from(editor.querySelectorAll('[data-slate-string]')).at(
      -1,
    )
    await waitFor(() => {
      placeCaretAtEnd(editor, last ?? null)
      expect(editor).toHaveFocus()
    })
    await userEvent.keyboard('{Enter}Combinar quem apresenta a revisão.')
    await waitFor(() =>
      expect(
        canvas.getByText(`Versão 1 gravada com ${playbook.length + 1} blocos.`),
      ).toBeVisible(),
    )
  },
}

export const LockedCopyForReview: Story = {
  args: { defaultSettings: { locked: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('document', { name: 'Conteúdo da página' }),
    ).toBeVisible()
    await expect(canvas.getByText('Página bloqueada')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }))
    await expect(
      await screen.findByRole('menuitemcheckbox', { name: 'Bloquear página' }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}
