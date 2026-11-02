'use client'

import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'
import { cn } from '@tc96/utils'
import type { RecordDialogHeadlineProps } from '../../core'

export function RecordDialogHeadline({
  description,
  descriptionLabel,
  descriptionName = 'description',
  descriptionPlaceholder,
  onDescriptionChange,
  onTitleChange,
  stretch = false,
  title,
  titleLabel,
  titleName = 'title',
  titlePlaceholder,
}: RecordDialogHeadlineProps) {
  return (
    <div
      className={stretch ? 'flex flex-1 flex-col gap-1' : 'grid gap-1'}
      data-slot="record-dialog-headline"
      data-stretch={stretch ? '' : undefined}
    >
      <Field name={titleName}>
        <FieldLabel className="sr-only">{titleLabel}</FieldLabel>
        <Input
          autoFocus
          className="w-full font-semibold text-lg [&_input]:px-0 [&_input]:placeholder:text-muted-foreground/60 [&_input]:focus:placeholder:text-muted-foreground"
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={titlePlaceholder}
          unstyled
          value={title}
        />
      </Field>
      {descriptionLabel === undefined ? null : (
        <Field
          className={stretch ? 'flex-1' : undefined}
          name={descriptionName}
        >
          <FieldLabel className="sr-only">{descriptionLabel}</FieldLabel>
          <Textarea
            className={cn(
              'w-full [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:pt-0.5 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground',
              stretch
                ? 'flex-1 [&_textarea]:min-h-24'
                : '[&_textarea]:min-h-16',
            )}
            onChange={
              onDescriptionChange
                ? (event) => onDescriptionChange(event.target.value)
                : undefined
            }
            placeholder={descriptionPlaceholder}
            unstyled
            value={description}
          />
        </Field>
      )}
    </div>
  )
}
