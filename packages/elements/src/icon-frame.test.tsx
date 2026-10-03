import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  IconFrame,
  iconFrameShapes,
  iconFrameSizes,
  iconFrameStyle,
  iconFrameVariants,
} from './icon-frame'

test('IconFrame offers three sizes, two shapes and two variants, circle and color by default', () => {
  expect(iconFrameSizes).toEqual(['default', 'lg', 'xl'])
  expect(iconFrameShapes).toEqual(['circle', 'rounded'])
  expect(iconFrameVariants()).toContain('rounded-full')
  expect(iconFrameVariants({ shape: 'rounded' })).toContain('rounded-lg')
  expect(iconFrameVariants()).toContain('size-9')
  expect(iconFrameVariants()).toContain('bg-muted')
  expect(iconFrameVariants({ size: 'lg' })).toContain('size-11')
  expect(iconFrameVariants({ size: 'xl' })).toContain('size-14')
  expect(iconFrameVariants({ variant: 'plain' })).toContain('bg-transparent')
})

test('IconFrame tints the background from the color only in the color variant', () => {
  expect(iconFrameStyle('#f7931a', 'color')).toEqual({
    backgroundColor: 'color-mix(in srgb, #f7931a 6%, transparent)',
    color: '#f7931a',
  })
  expect(iconFrameStyle('#f7931a', 'plain')).toEqual({ color: '#f7931a' })
  expect(iconFrameStyle(undefined, 'color')).toBeUndefined()
})

test('IconFrame renders a decorative span with data attributes and accepts render', () => {
  const markup = renderToStaticMarkup(
    <IconFrame color="#627eea" size="xl">
      <svg />
    </IconFrame>,
  )
  expect(markup).toContain('aria-hidden="true"')
  expect(markup).toContain('data-slot="icon-frame"')
  expect(markup).toContain('data-size="xl"')
  expect(markup).toContain('data-shape="circle"')
  expect(markup).toContain('data-variant="color"')
  expect(markup).toContain('color:#627eea')
  expect(
    renderToStaticMarkup(<IconFrame render={<div />} variant="plain" />),
  ).toContain('<div')
})
