import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Title } from './title'

test('Title standardizes typography while allowing size, weight and semantics', () => {
  const compact = renderToStaticMarkup(
    <Title size="sm" weight="normal">
      Compact title
    </Title>,
  )
  const heading = renderToStaticMarkup(
    <Title render={<h2 />} size="lg" weight="bold">
      Section title
    </Title>,
  )

  expect(compact).toContain('text-sm')
  expect(compact).toContain('font-normal')
  expect(heading).toContain('<h2')
  expect(heading).toContain('text-lg')
  expect(heading).toContain('font-bold')
})
