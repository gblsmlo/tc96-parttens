import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'

export function useInspectorDock() {
  return useMediaQuery('md')
}
