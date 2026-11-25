import { SettingsRowsSkeleton } from '../../shared/settings-skeleton'

export function SettingsWorkspace1Skeleton() {
  return (
    <>
      <SettingsRowsSkeleton count={1} start="avatar" end="button" />
      <SettingsRowsSkeleton count={3} end="select" />
    </>
  )
}
