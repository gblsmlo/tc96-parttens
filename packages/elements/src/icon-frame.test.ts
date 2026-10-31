import { expect, test } from 'bun:test'
import {
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
