import { XIcon } from '@phosphor-icons/react'
import { Input } from '@tc96/ui/input'
import { propertyDisplayIcons } from '@tc96/ui/patterns/properties/core'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { Popover, PopoverTrigger } from '@tc96/ui/popover'
import { useEntryListEditor } from '../../../../patterns/properties/hooks/use-entry-list-editor'
import { PropertyAddTrigger } from '../../../../patterns/properties/shared/property-add-trigger'
import { PropertyEntryForm } from '../../../../patterns/properties/shared/property-entry-form'
import { PropertyRow } from '../../../../patterns/properties/shared/property-row'
import type { PropertyVariant } from '../../../../patterns/properties/shared/property-surface'
import { formatContactDocument, parseContactDocument } from './contact-document'

const DocumentIcon = propertyDisplayIcons.document

const documentLabels = {
  add: 'Documento',
  addAnother: 'Adicionar outro',
  duplicate: 'Este documento já está na lista.',
  entries: ['Documento', 'Documento', 'Documento', 'Documento'],
  removeEntry: (entry: string) => `Remover ${entry}`,
  save: 'Salvar',
}

export function ContactDocumentProperty({
  ariaLabel,
  className,
  onValueChange,
  placeholder,
  value,
  variant = 'badge',
}: Readonly<{
  ariaLabel: string
  className?: string
  onValueChange: (value: readonly string[]) => void
  placeholder: string
  value: readonly string[]
  variant?: PropertyVariant
}>) {
  const editor = useEntryListEditor({
    duplicateMessage: documentLabels.duplicate,
    limit: documentLabels.entries.length,
    onCommit: (next) => onValueChange(next),
    parse: parseContactDocument,
    value,
  })

  return (
    <PropertyRow
      ariaLabel={ariaLabel}
      className={className}
      slot="contact-document-property"
      variant={variant}
    >
      {value.map((document) => (
        <IconLabelProperty
          className="pe-0"
          icon={DocumentIcon}
          key={document}
          label={document}
          trailing={
            <button
              aria-label={`${documentLabels.removeEntry('')} ${document}`.trim()}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() =>
                onValueChange(value.filter((current) => current !== document))
              }
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          }
          variant={variant}
        />
      ))}
      <Popover onOpenChange={editor.onOpenChange} open={editor.open}>
        <PopoverTrigger
          render={
            <PropertyAddTrigger
              addLabel={ariaLabel}
              hasValue={value.length > 0}
              icon={DocumentIcon}
              placeholder={placeholder}
              variant={variant}
            />
          }
        />
        <PropertyEntryForm
          canAddAnother={editor.canAddAnother}
          drafts={editor.drafts}
          errors={editor.errors}
          labels={documentLabels}
          onAdd={editor.addDraft}
          onChange={(index, next) =>
            editor.setDraft(index, formatContactDocument(next))
          }
          onRemove={editor.removeDraft}
          onSave={editor.save}
          renderField={(field) => (
            <Input
              aria-invalid={field.invalid || undefined}
              aria-label={field.ariaLabel}
              className="min-w-0 flex-1"
              inputMode="numeric"
              onChange={(event) => field.onChange(event.currentTarget.value)}
              onKeyDown={field.onKeyDown}
              placeholder="000.000.000-00"
              size="sm"
              value={field.draft}
            />
          )}
        />
      </Popover>
    </PropertyRow>
  )
}
