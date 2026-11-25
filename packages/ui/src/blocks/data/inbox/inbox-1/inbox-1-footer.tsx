import { Button } from '@tc96/ui/button'
import type { Inbox1Labels } from './types'

export interface Inbox1FooterProps {
  hasMore: boolean
  labels: Inbox1Labels
  loadingMore: boolean
  loadMoreError: boolean
  markError: boolean
  onLoadMore?: () => void
}

export function Inbox1Footer({
  hasMore,
  labels,
  loadingMore,
  loadMoreError,
  markError,
  onLoadMore,
}: Readonly<Inbox1FooterProps>) {
  const showsLoadMore = hasMore && Boolean(onLoadMore)
  if (!loadMoreError && !markError && !showsLoadMore) return null

  return (
    <div
      className="flex flex-col items-center gap-2"
      data-slot="inbox-1-footer"
    >
      {loadMoreError ? (
        <p className="text-destructive-foreground text-sm" role="alert">
          {labels.loadMoreError}
        </p>
      ) : null}
      {markError ? (
        <p className="text-destructive-foreground text-sm" role="alert">
          {labels.markError}
        </p>
      ) : null}
      {showsLoadMore ? (
        <Button
          disabled={loadingMore}
          onClick={onLoadMore}
          size="sm"
          type="button"
          variant="outline"
        >
          {labels.loadMore}
        </Button>
      ) : null}
    </div>
  )
}
