import { expect, test } from 'bun:test'
import { avatarSizes, avatarVariants } from './avatar'

test('Avatar offers five sizes, 4, 6, 8, 10 and 12, default 8', () => {
  expect(avatarSizes).toEqual(['xs', 'sm', 'default', 'lg', 'xl'])
  expect(avatarVariants({ size: 'xs' })).toContain('size-4')
  expect(avatarVariants({ size: 'sm' })).toContain('size-6')
  expect(avatarVariants()).toContain('size-8')
  expect(avatarVariants({ size: 'lg' })).toContain('size-10')
  expect(avatarVariants({ size: 'xl' })).toContain('size-12')
})
