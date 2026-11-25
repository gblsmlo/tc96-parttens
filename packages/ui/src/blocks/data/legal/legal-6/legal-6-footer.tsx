import { Button } from '@tc96/ui/button'
import type { Legal6Labels } from './types'

export interface Legal6FooterProps {
  hasMore: boolean
  labels: Legal6Labels
  loadingMore: boolean
  loadMoreError: boolean
  nextViewLabel: string | null
  onLoadMore?: () => void
  onSeeNextView: () => void
}

export function Legal6Footer({
  hasMore,
  labels,
  loadingMore,
  loadMoreError,
  nextViewLabel,
  onLoadMore,
  onSeeNextView,
}: Readonly<Legal6FooterProps>) {
  const showsLoadMore = hasMore && Boolean(onLoadMore)
  if (!nextViewLabel && !loadMoreError && !showsLoadMore) return null

  return (
    <div
      className="flex flex-col items-center gap-2"
      data-slot="legal-6-footer"
    >
      {nextViewLabel ? (
        <Button onClick={onSeeNextView} size="sm" type="button" variant="link">
          {labels.seeView(nextViewLabel)}
        </Button>
      ) : null}
      {loadMoreError ? (
        <p className="text-destructive-foreground text-sm" role="alert">
          {labels.loadMoreError}
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
