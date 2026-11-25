import { Skeleton } from '@tc96/ui/skeleton'
import { SettingsTableSkeleton } from '../../shared/settings-skeleton'

export function SettingsNotificationChannel1Skeleton() {
  return (
    <>
      <div className="flex gap-4 py-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
      <SettingsTableSkeleton columns={4} rows={5} />
    </>
  )
}
