import {
  SettingsCollapsedSkeleton,
  SettingsRowsSkeleton,
} from '../shared/settings-skeleton'

export function Settings10Skeleton() {
  return (
    <>
      <SettingsCollapsedSkeleton key="group-0">
        <SettingsRowsSkeleton count={3} description={false} end="menu" />
      </SettingsCollapsedSkeleton>
      <SettingsCollapsedSkeleton key="group-1">
        <SettingsRowsSkeleton count={3} description={false} end="menu" />
      </SettingsCollapsedSkeleton>
    </>
  )
}
