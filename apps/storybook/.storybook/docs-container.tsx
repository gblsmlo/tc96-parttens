import {
  DocsContainer,
  type DocsContainerProps,
} from '@storybook/addon-docs/blocks'
import type { PropsWithChildren, ReactElement } from 'react'
import { useSyncExternalStore } from 'react'
import { themes } from 'storybook/theming'

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    attributes: true,
  })
  return () => observer.disconnect()
}

const isDark = () => document.documentElement.classList.contains('dark')

export function ThemedDocsContainer({
  children,
  ...props
}: PropsWithChildren<DocsContainerProps>): ReactElement {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)

  return (
    <DocsContainer {...props} theme={dark ? themes.dark : themes.light}>
      {children}
    </DocsContainer>
  )
}
