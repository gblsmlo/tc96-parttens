import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'

export function RecordHeadline({
  descriptionPlaceholder,
  onTitleChange,
  stretch = false,
  title,
  titleLabel,
  titlePlaceholder,
}: Readonly<{
  descriptionPlaceholder: string
  onTitleChange: (title: string) => void
  stretch?: boolean
  title: string
  titleLabel: string
  titlePlaceholder: string
}>) {
  return (
    <div className={stretch ? 'flex flex-1 flex-col gap-1' : 'grid gap-1'}>
      <Field name="title">
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
      <Field className={stretch ? 'flex-1' : undefined} name="description">
        <FieldLabel className="sr-only">Description</FieldLabel>
        <Textarea
          className={`w-full [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:pt-0.5 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground ${stretch ? 'flex-1 [&_textarea]:min-h-24' : '[&_textarea]:min-h-16'}`}
          placeholder={descriptionPlaceholder}
          unstyled
        />
      </Field>
    </div>
  )
}
