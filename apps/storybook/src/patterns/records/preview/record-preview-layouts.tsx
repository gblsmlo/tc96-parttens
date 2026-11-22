import {
  RecordPreview,
  RecordPreviewAction,
  RecordPreviewBody,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import type { RecordPreviewControls } from './record-preview-controls.ts'

const shortParagraphs = [
  'The shell has no content of its own: the consumer passes the body.',
  "Groups, fields and widgets are the consumer's, stacked as it sees fit.",
  'The header and the footer stay in place while the panel scrolls.',
]

const longParagraphs = Array.from(
  { length: 24 },
  (_, index) =>
    `Line ${index + 1} of the record body. The panel scrolls while the header and the footer stay in place.`,
)

interface ComposedRecordPreviewProps extends RecordPreviewControls {
  defaultOpen?: boolean
}

export const ComposedRecordPreview = ({
  actionLabel,
  actions,
  body,
  closeLabel,
  defaultOpen = true,
  description,
  footer,
  longContent,
  title,
  trigger,
}: Readonly<ComposedRecordPreviewProps>) => {
  const [open, setOpen] = useState(defaultOpen)
  const paragraphs = (longContent ? longParagraphs : shortParagraphs).map(
    (text) => (
      <p className="text-sm" key={text}>
        {text}
      </p>
    ),
  )

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {trigger}
      </Button>
      <RecordPreview
        actions={
          actions ? (
            <RecordPreviewAction label={actionLabel}>
              <Maximize2Icon aria-hidden />
            </RecordPreviewAction>
          ) : undefined
        }
        closeLabel={closeLabel}
        description={description || undefined}
        footer={
          footer ? (
            <>
              <Button onClick={() => setOpen(false)} variant="ghost">
                Cancel
              </Button>
              <Button>Restore</Button>
            </>
          ) : undefined
        }
        onOpenChange={setOpen}
        open={open}
        title={title}
      >
        {body ? (
          <RecordPreviewBody>{paragraphs}</RecordPreviewBody>
        ) : (
          paragraphs
        )}
      </RecordPreview>
    </>
  )
}
