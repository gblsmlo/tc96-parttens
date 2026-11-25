import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@tc96/ui/alert-dialog'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { richTextToHtml, richTextToPlainText } from '@tc96/ui/helpers/rich-text'
import {
  EditorTitle,
  RichTextEditor,
  type RichTextValue,
  useRichTextEditor,
} from '@tc96/ui/patterns/rich-text-editor'
import { ToastProvider, toastManager } from '@tc96/ui/toast'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { resolveRichTextEditor1Labels } from './labels'
import { RichTextEditor1Footer } from './rich-text-editor-1-footer'
import { RichTextEditor1MenuItems } from './rich-text-editor-1-menu-items'
import { RichTextEditor1Toolbar } from './rich-text-editor-1-toolbar'
import type {
  RichTextEditor1CopyFormat,
  RichTextEditor1NavbarContext,
  RichTextEditor1Props,
} from './types'
import { useDebouncedSave } from './use-debounced-save'
import { useReadOnly } from './use-read-only'

const emptyDocument = (): RichTextValue => [
  { children: [{ text: '' }], type: 'p' },
]

const features = { align: true, h1: true }

export function RichTextEditor1({
  className,
  defaultReadOnly = false,
  defaultTitle = '',
  defaultValue,
  description,
  labels: labelsProp,
  navbar,
  onChange,
  onClear,
  onCopy,
  onReadOnlyChange,
  onSave,
  onTitleChange,
  readOnly: readOnlyProp,
  saveDelay = 800,
  status,
}: Readonly<RichTextEditor1Props>) {
  const labels = resolveRichTextEditor1Labels(labelsProp)
  const editor = useRichTextEditor({
    features,
    ...(defaultValue ? { defaultValue } : {}),
  })
  const [readOnly, setReadOnly] = useReadOnly(
    readOnlyProp,
    defaultReadOnly,
    onReadOnlyChange,
  )
  const [title, setTitle] = useState(defaultTitle)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const save = useDebouncedSave(onSave, saveDelay)

  const handleValueChange = (value: RichTextValue) => {
    onChange?.(value)
    save.schedule(value)
  }

  const handleTitleChange = (next: string) => {
    setTitle(next)
    onTitleChange?.(next)
  }

  const handleCopy = (format: RichTextEditor1CopyFormat) => {
    const value = editor.children as RichTextValue
    const content =
      format === 'html' ? richTextToHtml(value) : richTextToPlainText(value)
    onCopy?.(format, content)
    toastManager.add({
      title: format === 'html' ? labels.copy.htmlDone : labels.copy.textDone,
    })
  }

  const handleClear = () => {
    const snapshot = structuredClone(editor.children) as RichTextValue
    editor.tf.setValue(emptyDocument())
    onClear?.()
    const id = toastManager.add({
      actionProps: {
        children: labels.clear.restore,
        onClick: () => {
          editor.tf.setValue(snapshot)
          toastManager.close(id)
        },
      },
      title: labels.clear.done,
    })
  }

  const context: RichTextEditor1NavbarContext = {
    menuItems: (
      <RichTextEditor1MenuItems
        labels={labels}
        onClear={() => setConfirmingClear(true)}
        onCopy={handleCopy}
        onReadOnlyChange={setReadOnly}
        readOnly={readOnly}
      />
    ),
    readOnly,
    status: status ? <Badge variant="secondary">{status}</Badge> : null,
  }
  const navbarNode = typeof navbar === 'function' ? navbar(context) : navbar

  return (
    <ToastProvider position="bottom-center">
      <div
        className={cn('flex w-full flex-col bg-background', className)}
        data-slot="rich-text-editor-1"
      >
        {navbarNode}
        <RichTextEditor
          aria-label={labels.document}
          blockLabels={{
            blockquote: labels.quote,
            h2: labels.blocks.h2,
            h3: labels.blocks.h3,
            ol: labels.numberedList,
            ul: labels.bulletList,
          }}
          className="mx-auto flex w-full max-w-4xl flex-1 flex-col"
          contentClassName="min-h-96 flex-1 px-6 pt-2 pb-12"
          editor={editor}
          floatingToolbar={false}
          linkLabels={labels.link}
          onValueChange={handleValueChange}
          paragraphLabel={labels.blocks.paragraph}
          placeholder={labels.placeholder}
          readOnly={readOnly}
          toolbar={
            <>
              {readOnly ? null : (
                <div className="sticky top-0 z-10 bg-background px-3 py-2">
                  <RichTextEditor1Toolbar labels={labels} />
                </div>
              )}
              <div
                className="flex flex-col gap-1 px-6 pt-6 pb-2"
                data-slot="rich-text-editor-1-heading"
              >
                {readOnly ? (
                  <h1 className="font-semibold text-2xl text-foreground tracking-tight">
                    {title || labels.emptyTitle}
                  </h1>
                ) : (
                  <EditorTitle
                    defaultValue={title}
                    emptyLabel={labels.emptyTitle}
                    label={labels.titleLabel}
                    onChange={handleTitleChange}
                  />
                )}
                {description ? (
                  <p className="text-muted-foreground text-sm">{description}</p>
                ) : null}
              </div>
            </>
          }
        >
          <RichTextEditor1Footer labels={labels} saveState={save.state} />
        </RichTextEditor>
      </div>
      <AlertDialog onOpenChange={setConfirmingClear} open={confirmingClear}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.clear.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.clear.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button size="sm" variant="ghost" />}>
              {labels.clear.cancel}
            </AlertDialogClose>
            <AlertDialogClose
              onClick={handleClear}
              render={<Button size="sm" variant="destructive" />}
            >
              {labels.clear.confirm}
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </ToastProvider>
  )
}
