import { useRef, useState } from 'react'

interface UseCollapsedGroupsOptions {
  controlled?: readonly string[]
  defaultValue: readonly string[]
  onChange?: (groupIds: readonly string[]) => void
}

export function useCollapsedGroups({
  controlled,
  defaultValue,
  onChange,
}: UseCollapsedGroupsOptions) {
  const [uncontrolled, setUncontrolled] =
    useState<readonly string[]>(defaultValue)
  const uncontrolledRef = useRef(uncontrolled)
  const collapsedGroupIds = controlled ?? uncontrolled

  function setGroupCollapsed(group: string, collapsed: boolean) {
    const current = controlled ?? uncontrolledRef.current
    const others = current.filter((id) => id !== group)
    const next = collapsed ? [...others, group] : others
    if (!controlled) {
      uncontrolledRef.current = next
      setUncontrolled(next)
    }
    onChange?.(next)
  }

  return { collapsedGroupIds, setGroupCollapsed }
}
