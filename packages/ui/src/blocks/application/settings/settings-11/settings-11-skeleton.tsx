import {
  SettingsCollapsedSkeleton,
  SettingsRowsSkeleton,
} from '../shared/settings-skeleton'

export function Settings11Skeleton() {
  return (
    <>
      <SettingsCollapsedSkeleton key="group-0">
        <SettingsRowsSkeleton count={2} description={false} end="menu" />
      </SettingsCollapsedSkeleton>
      <SettingsCollapsedSkeleton key="group-1">
        <SettingsRowsSkeleton count={2} description={false} end="menu" />
      </SettingsCollapsedSkeleton>
      <SettingsCollapsedSkeleton key="group-2">
        <SettingsRowsSkeleton count={2} description={false} end="menu" />
      </SettingsCollapsedSkeleton>
    </>
  )
}
