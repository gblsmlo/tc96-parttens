import {
  Controls,
  Description,
  Heading,
  Markdown,
  Primary,
  Source,
  Stories,
  Subheading,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks'
import { Fragment, type ReactElement } from 'react'

export interface ApiReferenceEntry {
  description: string
  name: string
}

export interface UsageDocsParameters {
  api?: readonly ApiReferenceEntry[]
  usage?: string
}

type Of = Parameters<typeof useOf>[0]

interface UsageBlockProps {
  of?: Of
}

function useUsageDocs(of: Of): UsageDocsParameters {
  const resolved = useOf(of, ['meta'])
  return (resolved.preparedMeta.parameters.docs ?? {}) as UsageDocsParameters
}

export function Usage({
  of = 'meta',
}: Readonly<UsageBlockProps>): ReactElement | null {
  const { usage } = useUsageDocs(of)
  if (!usage) return null

  return (
    <>
      <Heading>Usage</Heading>
      <Source code={usage.trim()} language="tsx" />
    </>
  )
}

export function ApiReference({
  of = 'meta',
}: Readonly<UsageBlockProps>): ReactElement | null {
  const { api } = useUsageDocs(of)
  if (!api?.length) return null

  return (
    <>
      <Heading>API Reference</Heading>
      {api.map((entry) => (
        <Fragment key={entry.name}>
          <Subheading>{entry.name}</Subheading>
          <Markdown>{entry.description}</Markdown>
        </Fragment>
      ))}
    </>
  )
}

export function DocsPage(): ReactElement {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <Usage />
      <Stories />
      <ApiReference />
    </>
  )
}
