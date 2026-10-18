import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { richTextTyping } from '../../../../test-utils/rich-text-typing'
import { NoteDialog } from '../note-dialog'
import {
  initialNotes,
  type Note,
  type NoteValues,
  noteRecordName,
} from '../note-record'

interface NotesArgs {
  note: Note | null
  onCopyLink: (id: string) => void
  onSave: (values: NoteValues) => void | Promise<void>
}

const meta = {
  argTypes: {
    note: { control: false },
    onCopyLink: { control: false },
    onSave: { control: false },
  },
  args: {
    note: null,
    onCopyLink: fn((_id: string) => {}),
    onSave: fn((_values: NoteValues) => {}),
  },
  parameters: {
    docs: {
      description: {
        component: [
          'RecordDialog as the note editor of a record, at the `large` size with `stretchBody`: the record name as the ancestor, then an `EditorTitle`, the author and Vínculos as `plain` property chips, and a `RichTextEditor` that fills the rest of the dialog. Enter or ArrowDown at the end of the title moves to the body, and ArrowUp at its first line goes back. Vínculos ties the note to other records: a menu with one submenu per kind (Contato, Lead, Contratos, Reunião), each holding checkbox items, with the number linked in that kind next to its name; the chip shows the one link with its kind icon or the count. A new note can be saved with a title or a body; an empty one cannot.',
          'The Notes usage of `Patterns/Records/Group/Usages` lists the notes of the record and opens the same dialog instance from a row or from the + action, and the dialog resets its fields when `note` changes.',
        ].join('\n\n'),
      },
      source: { inlineLimit: 250 },
    },
  },
  render: function Notes({ note, onCopyLink, onSave }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          {note ? 'Abrir nota' : 'Nova nota'}
        </Button>
        <NoteDialog
          note={note}
          onCopyLink={onCopyLink}
          onOpenChange={setOpen}
          onSave={onSave}
          open={open}
          recordName={noteRecordName}
        />
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Usages/Notes',
} satisfies Meta<NotesArgs>

export default meta

type Story = StoryObj<NotesArgs>

const body = richTextTyping('Conteúdo da nota')

const linkKind = (kind: string) =>
  screen.findByRole('menuitem', { name: new RegExp(`^${kind}`) })

const toggleLink = async (kind: string, name: string, checked: boolean) => {
  await userEvent.click(await linkKind(kind))
  const item = await screen.findByRole('menuitemcheckbox', { name })
  await userEvent.click(item)
  await waitFor(() =>
    expect(item).toHaveAttribute('aria-checked', String(checked)),
  )
}

const closeMenu = async () => {
  let open = screen.queryAllByRole('menu').length
  while (open > 0) {
    const before = open
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryAllByRole('menu').length).toBeLessThan(before),
    )
    open = screen.queryAllByRole('menu').length
  }
}

export const Create: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A new note for Helena Duarte: the title is focused, the author is the current user and nothing is linked. Criar nota stays disabled until the title or the body has text.',
      },
    },
  },
}

export const CreateInteraction: Story = {
  ...Create,
  play: async ({ args }) => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Nova nota' }),
    )
    const create = dialog.getByRole('button', { name: /Criar nota/ })
    const title = dialog.getByRole('textbox', { name: 'Título da nota' })

    await expect(dialog.getByText(noteRecordName)).toBeVisible()
    await expect(dialog.getByText('Gabriel Melo')).toBeVisible()
    await expect(
      dialog.queryByRole('button', { name: 'Copiar link' }),
    ).toBeNull()
    await expect(create).toBeDisabled()
    await waitFor(() => expect(title).toHaveFocus())

    await userEvent.type(title, 'Retorno da consulta{Enter}')
    await expect(create).toBeEnabled()
    await body.startTyping(document.body, 'Enviar a proposta até sexta.')

    await userEvent.click(dialog.getByRole('button', { name: 'Vínculos' }))
    const menu = within(await screen.findByRole('menu'))
    await expect(
      menu.getAllByRole('menuitem').map((kind) => kind.textContent),
    ).toEqual(['Contato', 'Lead', 'Contratos', 'Reunião'])
    await expect(menu.getByRole('menuitem', { name: 'Lead' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    )
    await toggleLink('Lead', 'Revisional bancária', true)
    await toggleLink('Contratos', 'Contrato de honorários', true)
    await expect(await linkKind('Lead')).toHaveTextContent('Lead1')
    await closeMenu()
    await expect(
      await dialog.findByRole('button', { name: 'Vínculos: 2 vínculos' }),
    ).toHaveTextContent('2 vínculos')

    await userEvent.click(create)
    await waitFor(() =>
      expect(args.onSave).toHaveBeenCalledWith({
        body: [
          { children: [{ text: 'Enviar a proposta até sexta.' }], type: 'p' },
        ],
        links: ['lead:banking', 'contract:fees'],
        title: 'Retorno da consulta',
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}

export const Edit: Story = {
  args: { note: initialNotes[0] },
  parameters: {
    docs: {
      description: {
        story:
          'An existing note opens with its title, body and links, and the header adds Copiar link, a shortcut the consumer owns. Mod+Enter saves from any field.',
      },
    },
  },
}

export const EditInteraction: Story = {
  ...Edit,
  play: async ({ args }) => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Editar nota' }),
    )
    const title = dialog.getByRole('textbox', { name: 'Título da nota' })

    await expect(title).toHaveValue('Preferências de contato')
    await expect(
      dialog.getByRole('textbox', { name: 'Conteúdo da nota' }),
    ).toHaveTextContent('Prefere contato por WhatsApp depois das 18h.')
    await userEvent.click(
      dialog.getByRole('button', { name: 'Vínculos: 2 vínculos' }),
    )
    await expect(await linkKind('Reunião')).toHaveTextContent('Reunião1')
    await toggleLink('Contratos', 'Contrato de honorários', false)
    await expect(await linkKind('Contratos')).toHaveTextContent(/^Contratos$/)
    await closeMenu()
    await expect(
      await dialog.findByRole('button', {
        name: 'Vínculos: Consulta inicial · 14/10',
      }),
    ).toBeVisible()

    await userEvent.click(dialog.getByRole('button', { name: 'Copiar link' }))
    await expect(args.onCopyLink).toHaveBeenCalledWith('note-contact')

    await userEvent.clear(title)
    await userEvent.type(title, 'Canal preferido')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() =>
      expect(args.onSave).toHaveBeenCalledWith({
        body: initialNotes[0]?.body,
        links: ['meeting:first'],
        title: 'Canal preferido',
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}
