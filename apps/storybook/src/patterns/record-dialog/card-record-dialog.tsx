import { SurfaceStates } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { type ReactNode, useState } from 'react'

export const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

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
