import { RecordDialog, SurfaceStates } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'
import { type ReactNode, useState } from 'react'
import { z } from 'zod'

export const cardSchema = z.object({
  description: z.string().trim().max(120, 'Keep the description short.'),
  title: z.string().trim().min(1, 'Title is required.'),
})

export type CardValues = z.infer<typeof cardSchema>

export const emptyCard: CardValues = { description: '', title: '' }

export const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

interface CardRecordDialogProps {
  defaultValues?: CardValues
  description?: ReactNode
  onOpenChange: (open: boolean) => void
  onSave: (values: CardValues) => void | Promise<void>
  open: boolean
  submitLabel: string
  title: ReactNode
}

export function CardRecordDialog({
  defaultValues = emptyCard,
  description,
  onOpenChange,
  onSave,
  open,
  submitLabel,
  title,
}: CardRecordDialogProps) {
  const [error, setError] = useState<string>()

  return (
    <RecordDialog
      cancelLabel="Cancel"
      description={description}
      errorMessage={error}
      onOpenChange={(next) => {
        if (!next) setError(undefined)
        onOpenChange(next)
      }}
      onSubmit={async (event) => {
        setError(undefined)
        const parsed = cardSchema.safeParse(
          Object.fromEntries(new FormData(event.currentTarget)),
        )
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message)
          return false
        }
        try {
          await onSave(parsed.data)
          return true
        } catch {
          setError('Could not save the card.')
          return false
        }
      }}
      open={open}
      submitLabel={submitLabel}
      submittingLabel="Saving"
      title={title}
      titleAncestor="Lemind"
    >
      <div className="grid gap-4">
        <Field name="title">
          <FieldLabel>Title</FieldLabel>
          <Input defaultValue={defaultValues.title} />
        </Field>
        <Field name="description">
          <FieldLabel>Description</FieldLabel>
          <Textarea defaultValue={defaultValues.description} />
        </Field>
      </div>
    </RecordDialog>
  )
}

interface DeleteCardDialogProps {
  onConfirm: () => boolean | Promise<boolean>
  onOpenChange: (open: boolean) => void
  open: boolean
  title: ReactNode
  titleAncestor?: string
}

export function DeleteCardDialog({
  onConfirm,
  onOpenChange,
  open,
  title,
  titleAncestor,
}: DeleteCardDialogProps) {
  const [error, setError] = useState<string>()

  return (
    <SurfaceStates
      cancelLabel="Cancel"
      confirmLabel="Delete"
      confirmingLabel="Deleting"
      description="The project and its history are removed. This cannot be undone."
      destructive
      errorMessage={error}
      onConfirm={async () => {
        setError(undefined)
        try {
          const confirmed = await onConfirm()
          if (!confirmed) setError('Could not delete the card.')
          return confirmed
        } catch {
          setError('Could not delete the card.')
          return false
        }
      }}
      onOpenChange={(next) => {
        if (!next) setError(undefined)
        onOpenChange(next)
      }}
      open={open}
      title={title}
      titleAncestor={titleAncestor}
    />
  )
}

export function DeleteCardDialogDemo({
  onOpenChange,
  ...props
}: Omit<DeleteCardDialogProps, 'open'>) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open dialog
      </Button>
      <DeleteCardDialog
        {...props}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange(next)
        }}
        open={open}
      />
    </>
  )
}
