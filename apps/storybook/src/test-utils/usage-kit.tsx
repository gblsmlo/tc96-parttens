import {
  EditorTitle,
  type EditorTitleHandle,
  RichTextEditor,
  type RichTextEditorHandle,
  type RichTextImage,
  type RichTextMention,
  type RichTextValue,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useCallback, useRef, useState } from 'react'

export interface StoredDocument {
  body: RichTextValue
  title: string
}

export function readStored(key: string): StoredDocument | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as StoredDocument) : null
  } catch {
    return null
  }
}

export function writeStored(key: string, value: StoredDocument): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function clearStored(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}

export function pickImageFile(): Promise<RichTextImage | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.hidden = true
    input.dataset.slot = 'usage-image-input'
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      input.remove()
      if (!file) {
        resolve(null)
        return
      }
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        resolve({ alt: file.name, url: String(reader.result) }),
      )
      reader.addEventListener('error', () => resolve(null))
      reader.readAsDataURL(file)
    })
    input.addEventListener('cancel', () => {
      input.remove()
      resolve(null)
    })
    document.body.append(input)
    input.click()
  })
}

export interface UsageDocumentProps {
  draggableBlocks?: boolean
  initial: StoredDocument
  label: string
  mentions?: readonly RichTextMention[]
  pickImage?: () => Promise<RichTextImage | null>
  pickImages?: boolean
  storageKey: string
  titleLabel: string
}

export function UsageDocument({
  draggableBlocks = false,
  initial,
  label,
  mentions,
  pickImage = pickImageFile,
  pickImages = false,
  storageKey,
  titleLabel,
}: Readonly<UsageDocumentProps>): React.ReactElement {
  const stored = useRef(readStored(storageKey))
  const [revision, setRevision] = useState(0)
  const [saved, setSaved] = useState(stored.current !== null)
  const doc = useRef<StoredDocument>(stored.current ?? initial)
  const title = useRef<EditorTitleHandle>(null)
  const body = useRef<RichTextEditorHandle>(null)

  const persist = useCallback(
    (next: Partial<StoredDocument>) => {
      doc.current = { ...doc.current, ...next }
      setSaved(writeStored(storageKey, doc.current))
    },
    [storageKey],
  )

  const reset = () => {
    clearStored(storageKey)
    doc.current = initial
    setSaved(false)
    setRevision((current) => current + 1)
  }

  return (
    <div
      className={
        draggableBlocks ? 'flex flex-col gap-4 ps-10' : 'flex flex-col gap-4'
      }
      data-slot="usage-document"
      key={revision}
    >
      <EditorTitle
        defaultValue={doc.current.title}
        emptyLabel={titleLabel}
        onArrowDownAtEnd={() => body.current?.focusStart()}
        onChange={(value) => persist({ title: value })}
        onEnter={() => body.current?.focusStart()}
        ref={title}
      />
      <RichTextEditor
        aria-label={label}
        defaultValue={doc.current.body}
        draggableBlocks={draggableBlocks}
        onExitStart={() => title.current?.focusEnd()}
        onValueChange={(value) => persist({ body: value })}
        placeholder="Escreva, ou digite / para escolher um bloco"
        ref={body}
        {...(mentions ? { mentions } : {})}
        {...(pickImages ? { onPickImage: pickImage } : {})}
      />
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <output aria-live="polite" data-slot="usage-status">
          {saved ? 'Salvo neste navegador' : 'Ainda não salvo'}
        </output>
        <Button onClick={reset} size="sm" type="button" variant="outline">
          Restaurar exemplo
        </Button>
      </div>
    </div>
  )
}

export const usageParameters = {
  layout: 'padded',
} as const

export const text = (value: string, marks: Record<string, boolean> = {}) => ({
  ...marks,
  text: value,
})

export const paragraph = (...children: unknown[]) => ({
  children,
  type: 'p',
})
