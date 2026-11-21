import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardPrimitive,
  PreviewCardTrigger,
} from '@tc96/ui/preview-card'
import { useState } from 'react'
import {
  type PreviewCardControls,
  previewCardControlArgs,
} from './preview-card-controls.ts'

export const previewCardLinkClassName =
  'font-medium underline underline-offset-4'

interface ComposedPreviewCardProps extends PreviewCardControls {
  closeDelay?: number
  delay?: number
  onOpenChange?: (open: boolean) => void
}

export const ComposedPreviewCard = ({
  align,
  avatar,
  closeDelay,
  delay,
  description,
  element,
  onOpenChange,
  open,
  sideOffset,
  title,
  trigger,
}: Readonly<ComposedPreviewCardProps>) => (
  <PreviewCard
    defaultOpen={open}
    key={String(open)}
    onOpenChange={onOpenChange}
  >
    {element === 'button' ? (
      <PreviewCardTrigger
        closeDelay={closeDelay}
        delay={delay}
        render={<Button variant="ghost" />}
      >
        {trigger}
      </PreviewCardTrigger>
    ) : (
      <PreviewCardTrigger
        className={previewCardLinkClassName}
        closeDelay={closeDelay}
        delay={delay}
        href="#preview"
      >
        {trigger}
      </PreviewCardTrigger>
    )}
    <PreviewCardPopup align={align} sideOffset={sideOffset}>
      <div className="flex gap-3">
        {avatar ? (
          <Avatar>
            <AvatarFallback>PT</AvatarFallback>
          </Avatar>
        ) : null}
        <div className="flex flex-col gap-1">
          {title ? <p className="font-medium">{title}</p> : null}
          {description ? (
            <p className="text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
    </PreviewCardPopup>
  </PreviewCard>
)

export const InTextPreviewCard = () => (
  <p className="max-w-sm text-sm">
    A sentence runs before{' '}
    <ComposedPreviewCard {...previewCardControlArgs} trigger="the link" /> and
    goes on after it, so the trigger reads in the flow of the text.
  </p>
)

interface SharedPreview {
  description: string
  title: string
}

const sharedPreviews = [
  {
    description: 'The preview of the first link.',
    id: 'shared-preview-first',
    label: 'First link',
    title: 'First preview',
  },
  {
    description: 'The preview of the second link.',
    id: 'shared-preview-second',
    label: 'Second link',
    title: 'Second preview',
  },
  {
    description: 'The preview of the third link.',
    id: 'shared-preview-third',
    label: 'Third link',
    title: 'Third preview',
  },
] as const

interface SharedPreviewCardProps {
  defaultOpen?: boolean
  delay?: number
}

export const SharedPreviewCard = ({
  defaultOpen = true,
  delay,
}: Readonly<SharedPreviewCardProps>) => {
  const [handle] = useState(() =>
    PreviewCardPrimitive.createHandle<SharedPreview>(),
  )

  return (
    <div className="flex items-start gap-4 text-sm">
      {sharedPreviews.map(({ description, id, label, title }) => (
        <PreviewCardTrigger
          className={previewCardLinkClassName}
          delay={delay}
          handle={handle}
          href={`#${id}`}
          id={id}
          key={id}
          payload={{ description, title }}
        >
          {label}
        </PreviewCardTrigger>
      ))}
      <PreviewCard
        defaultOpen={defaultOpen}
        defaultTriggerId={defaultOpen ? sharedPreviews[0].id : undefined}
        handle={handle}
      >
        {({ payload }) => (
          <PreviewCardPopup align="start">
            <div className="flex flex-col gap-1">
              <p className="font-medium">{payload?.title}</p>
              <p className="text-muted-foreground">{payload?.description}</p>
            </div>
          </PreviewCardPopup>
        )}
      </PreviewCard>
    </div>
  )
}
