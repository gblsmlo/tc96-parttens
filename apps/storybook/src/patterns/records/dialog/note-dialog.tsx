import {
  EditorTitle,
  type EditorTitleHandle,
  MenuCheckboxOption,
  PersonProperty,
  PropertySurface,
  RecordDialog,
  RichTextEditor,
  type RichTextEditorHandle,
  type RichTextValue,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuPopup,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Link2Icon, LinkIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import {
  isNoteEmpty,
  type Note,
  type NoteValues,
  noteAuthor,
  noteAuthors,
  noteLink,
  noteLinkGroups,
} from './note-record'

function LinksProperty({
  onValueChange,
  value,
}: Readonly<{
  onValueChange: (value: readonly string[]) => void
  value: readonly string[]
}>) {
  const single = value.length === 1 ? noteLink(value[0] ?? '') : null
  const Icon = single?.icon ?? Link2Icon
  const summary =
    value.length === 0 ? null : (single?.label ?? `${value.length} vínculos`)

  return (
    <Menu>
      <MenuTrigger
        render={
          <PropertySurface
            aria-label={summary ? `Vínculos: ${summary}` : undefined}
            muted={summary === null}
            render={<button type="button" />}
            variant="plain"
          />
        }
      >
        <Icon aria-hidden className="size-3.5" />
        {summary ?? 'Vínculos'}
      </MenuTrigger>
      <MenuPopup align="start">
        {noteLinkGroups.map(({ icon: GroupIcon, label, options }) => {
          const linked = options.filter((option) =>
            value.includes(option.value),
          ).length

          return (
            <MenuSub key={label}>
              <MenuSubTrigger>
                <GroupIcon aria-hidden />
                <span className="flex-1">{label}</span>
                {linked > 0 ? (
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {linked}
                  </span>
                ) : null}
              </MenuSubTrigger>
              <MenuSubPopup>
                {options.map((option) => (
                  <MenuCheckboxOption
                    checked={value.includes(option.value)}
                    key={option.value}
                    onCheckedChange={(checked) =>
                      onValueChange(
                        checked
                          ? [...value, option.value]
                          : value.filter((link) => link !== option.value),
                      )
                    }
                  >
                    {option.label}
                  </MenuCheckboxOption>
                ))}
              </MenuSubPopup>
            </MenuSub>
          )
        })}
      </MenuPopup>
    </Menu>
  )
}

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
  const [links, setLinks] = useState(note?.links ?? [])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const titleRef = useRef<EditorTitleHandle>(null)
  const bodyRef = useRef<RichTextEditorHandle>(null)
  const values = { body, links, title: title.trim() }

  const reset = () => {
    setTitle(note?.title ?? '')
    setBody(note?.body ?? [])
    setLinks(note?.links ?? [])
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
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 pt-6">
        <div className="flex flex-col gap-2">
          <EditorTitle
            autoFocus
            defaultValue={title}
            emptyLabel="Nota sem título"
            label="Título da nota"
            onArrowDownAtEnd={() => bodyRef.current?.focusStart()}
            onChange={setTitle}
            onEnter={() => bodyRef.current?.focusStart()}
            ref={titleRef}
          />
          <div className="flex flex-wrap items-center gap-2">
            <PersonProperty
              ariaLabel="Autor"
              options={noteAuthors}
              readOnly
              value={note?.author ?? noteAuthor}
              variant="plain"
            />
            <LinksProperty onValueChange={setLinks} value={links} />
          </div>
        </div>
        <RichTextEditor
          aria-label="Conteúdo da nota"
          className="flex-1"
          defaultValue={body.length > 0 ? body : undefined}
          onExitStart={() => titleRef.current?.focusEnd()}
          onValueChange={setBody}
          placeholder="Comece a escrever sua nota"
          ref={bodyRef}
        />
      </div>
    </RecordDialog>
  )
}
