import { CheckIcon, LinkIcon, UserPlusIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { IconFrame } from '@tc96/ui/icon-frame'
import { defaultEmptyState4Labels } from './labels'
import type { EmptyState4Props } from './types'

export function EmptyState4({
  className,
  copied = false,
  labels: labelsProp,
  onCopyLink,
  onInvite,
}: Readonly<EmptyState4Props>) {
  const labels = { ...defaultEmptyState4Labels, ...labelsProp }

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia>
          <IconFrame size="xl">
            <UserPlusIcon />
          </IconFrame>
        </EmptyMedia>
        <EmptyTitle>{labels.title}</EmptyTitle>
        <EmptyDescription>{labels.description}</EmptyDescription>
      </EmptyHeader>
      {onInvite || onCopyLink ? (
        <EmptyContent className="flex-row flex-wrap justify-center">
          {onInvite ? (
            <Button onClick={onInvite} size="sm">
              <UserPlusIcon aria-hidden="true" />
              {labels.invite}
            </Button>
          ) : null}
          {onCopyLink ? (
            <Button
              data-copied={copied ? 'true' : 'false'}
              onClick={onCopyLink}
              size="sm"
              variant="outline"
            >
              {copied ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <LinkIcon aria-hidden="true" />
              )}
              {copied ? labels.copied : labels.copyLink}
            </Button>
          ) : null}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
