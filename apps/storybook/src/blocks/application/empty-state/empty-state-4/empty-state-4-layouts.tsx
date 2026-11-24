import { EmptyState4 } from '@tc96/ui/blocks/application/empty-state/empty-state-4'
import type { EmptyState4Controls } from './empty-state-4-controls.ts'

export const ComposedEmptyState4 = ({
  copied,
  copyLink,
  invite,
  title,
}: Readonly<EmptyState4Controls>) => (
  <EmptyState4
    copied={copied}
    labels={{ title }}
    onCopyLink={copyLink ? () => {} : undefined}
    onInvite={invite ? () => {} : undefined}
  />
)
