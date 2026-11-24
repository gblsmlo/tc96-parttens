import {
  PersonProperty,
  RecordDialog,
  RecordDialogHeadline,
  RichTextEditor,
  type RichTextValue,
  SelectProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { LinkIcon } from 'lucide-react'
import { useState } from 'react'
import {
  isNoteEmpty,
  type Note,
  type NoteValues,
  noteAuthors,
  notePriorityOptions,
  noteStatusOptions,
} from './note-record'

export interface NoteDialogProps {
  note: Note | null
  onCopyLink: (id: string) => void
  onOpenChange: (open: boolean) => void
  onSave: (values: NoteValues) => void | Promise<void>
  open: boolean
  recordName: string
}

export function NoteDialog({
  note,
  onCopyLink,
  onOpenChange,
  onSave,
  open,
  recordName,
}: Readonly<NoteDialogProps>) {
  const [shownNote, setShownNote] = useState(note)
  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState<RichTextValue>(note?.body ?? [])
  const [status, setStatus] = useState(note?.status ?? 'planned')
  const [priority, setPriority] = useState(note?.priority ?? 'none')
  const [responsible, setResponsible] = useState(note?.responsible ?? null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const values = { body, priority, responsible, status, title: title.trim() }

  const reset = () => {
    setTitle(note?.title ?? '')
    setBody(note?.body ?? [])
    setStatus(note?.status ?? 'planned')
    setPriority(note?.priority ?? 'none')
    setResponsible(note?.responsible ?? null)
    setErrorMessage(null)
  }

  if (note !== shownNote) {
    setShownNote(note)
    reset()
  }

  return (
    <RecordDialog
      actions={
        note ? (
          <Button
            aria-label="Copiar link"
            onClick={() => onCopyLink(note.id)}
            size="icon"
            variant="ghost"
          >
            <LinkIcon aria-hidden />
          </Button>
        ) : undefined
      }
      errorMessage={errorMessage}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
      onSubmit={async () => {
        setErrorMessage(null)
        try {
          await onSave(values)
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Não foi possível salvar.',
          )
          return false
        }
        return true
      }}
      bodyWidth="readable"
      open={open}
      size="large"
      stretchBody
      submitDisabled={isNoteEmpty(values)}
      submitLabel={note ? 'Salvar nota' : 'Criar nota'}
      submitOnModEnter
      submittingLabel="Salvando"
      title={note ? 'Editar nota' : 'Nova nota'}
      titleAncestor={recordName}
    >
      <div className="flex flex-1 flex-col">
        <RecordDialogHeadline
          onTitleChange={setTitle}
          title={title}
          titleLabel="Título da nota"
          titlePlaceholder="Nota sem título"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SelectProperty
            ariaLabel="Status"
            onValueChange={(value) => setStatus(value ?? 'planned')}
            options={noteStatusOptions}
            value={status}
            variant="plain"
          />
          <SelectProperty
            ariaLabel="Prioridade"
            onValueChange={(value) => setPriority(value ?? 'none')}
            options={notePriorityOptions}
            value={priority}
            variant="plain"
          />
          <PersonProperty
            ariaLabel="Responsável"
            onValueChange={setResponsible}
            options={noteAuthors}
            placeholder="Responsável"
            value={responsible}
            variant="plain"
          />
        </div>
        <div className="flex flex-1 flex-col pt-6">
          <RichTextEditor
            aria-label="Conteúdo da nota"
            className="flex-1"
            defaultValue={body.length > 0 ? body : undefined}
            onValueChange={setBody}
            placeholder="Comece a escrever sua nota"
          />
        </div>
      </div>
    </RecordDialog>
  )
}
