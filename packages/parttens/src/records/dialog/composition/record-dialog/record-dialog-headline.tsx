'use client'

import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'
import type { RecordDialogHeadlineProps } from '../../core'

export function RecordDialogHeadline({
  description,
  descriptionLabel,
  descriptionName = 'description',
  descriptionPlaceholder,
  onDescriptionChange,
  onTitleChange,
  title,
  titleLabel,
  titleName = 'title',
  titlePlaceholder,
}: RecordDialogHeadlineProps) {
  return (
    <div className="grid gap-1" data-slot="record-dialog-headline">
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
        <Field name={descriptionName}>
          <FieldLabel className="sr-only">{descriptionLabel}</FieldLabel>
          <Textarea
            className="grid w-full [&_textarea]:min-h-0 [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:pt-0.5 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground"
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
