import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import {
  SettingsSectionSkeleton,
  SettingsTableSkeleton,
} from '../../shared/settings-skeleton'

export function SettingsAccount2Skeleton() {
  return (
    <>
      <Card>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-8 w-28 shrink-0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </Card>
      <SettingsSectionSkeleton description>
        <SettingsTableSkeleton columns={4} rows={4} />
      </SettingsSectionSkeleton>
    </>
  )
}
