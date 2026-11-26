'use client'

import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'
import type { RecordDialogHeadlineProps } from '../../core'
import { recordDialogDescriptionVariants } from '../../lib/variants'

export function RecordDialogHeadline({
  description,
  descriptionLabel,
  descriptionMinHeight,
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
            className={recordDialogDescriptionVariants({
              minHeight: descriptionMinHeight,
            })}
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
