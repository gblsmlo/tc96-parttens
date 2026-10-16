import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Avatar, AvatarFallback, avatarSizes, avatarVariants } from './avatar'

test('Avatar offers four sizes, 6, 8, 10 and 12, default 8', () => {
  expect(avatarSizes).toEqual(['sm', 'default', 'lg', 'xl'])
  expect(avatarVariants({ size: 'sm' })).toContain('size-6')
  expect(avatarVariants()).toContain('size-8')
  expect(avatarVariants({ size: 'lg' })).toContain('size-10')
  expect(avatarVariants({ size: 'xl' })).toContain('size-12')
})

test('Avatar replaces the COSS size and exposes it as a data attribute', () => {
  const markup = renderToStaticMarkup(
    <Avatar size="xl">
      <AvatarFallback>AV</AvatarFallback>
    </Avatar>,
  )
  expect(markup).toContain('data-slot="avatar"')
  expect(markup).toContain('data-size="xl"')
  expect(markup).toContain('size-12')
  expect(markup).not.toContain('size-8')
  expect(renderToStaticMarkup(<Avatar />)).toContain('data-size="default"')
})
