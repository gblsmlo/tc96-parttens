import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { classify, findOverrides } from './check-overrides'

let root = ''

const ui = {
  'button.tsx': `export function Button({ className }) {
  return <button className={cn("rounded-lg bg-primary", className)} data-slot="button" />
}
export const buttonVariants = cva("rounded-lg")`,
  'menu.tsx': `export function MenuTrigger({ className }) {
  return <Trigger className={className} data-slot="menu-trigger" />
}`,
  'skeleton.tsx': `export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-sm bg-accent", className)} />
}`,
}

async function overrides(sources: Record<string, string>) {
  root = await mkdtemp(join(tmpdir(), 'tc96-overrides-'))
  for (const [path, content] of Object.entries({
    ...Object.fromEntries(
      Object.entries(ui).map(([file, content]) => [`ui/${file}`, content]),
    ),
    ...sources,
  })) {
    await mkdir(dirname(join(root, path)), { recursive: true })
    await writeFile(join(root, path), content)
  }
  const found = await findOverrides([join(root, 'src')], join(root, 'ui'))
  return found.map(({ className, component }) => `${component} ${className}`)
}

afterEach(() => rm(root, { recursive: true, force: true }))

test('allows layout, dimension, typography, neutralizing and visibility', () => {
  for (const token of [
    'w-full',
    'md:h-10',
    'gap-1.5',
    'text-sm',
    'text-left',
    'font-medium',
    'bg-transparent!',
    'border-0',
    'shadow-none',
    'rounded-none',
    'focus-visible:opacity-100',
    '[&_svg]:mx-0',
    'before:hidden',
  ])
    expect(classify('Button', token)).toBeUndefined()
})

test('rejects new color, radius, border and shadow', () => {
  expect(classify('Button', 'text-muted-foreground')).toBe('cor')
  expect(classify('Button', 'hover:bg-accent/40')).toBe('cor')
  expect(classify('Button', 'rounded-full')).toBe('raio')
  expect(classify('Button', 'border-dashed')).toBe('borda')
  expect(classify('Button', 'focus-visible:ring-2')).toBe('borda')
  expect(classify('Button', 'shadow-sm/5')).toBe('sombra')
  expect(classify('Button', 'opacity-50')).toBe('opacidade')
})

test('lets the Skeleton take any shape', () => {
  expect(classify('Skeleton', 'rounded-full')).toBeUndefined()
})

test('checks styled COSS components, following local and imported constants', async () => {
  expect(
    await overrides({
      'src/shared.ts': "export const pill = 'h-6 rounded-full'\n",
      'src/a.tsx': `import { Button } from '@tc96/ui/button'
import { pill } from './shared'
const muted = 'text-muted-foreground'
export const A = () => <>
  <Button className={cn('w-full', muted)} />
  <Button className={pill} />
  <Button className={cn(variant === 'ghost' && 'shadow-none')} />
</>
`,
    }),
  ).toEqual(['Button text-muted-foreground', 'Button rounded-full'])
})

test('ignores unstyled COSS parts and the own markup of the pattern', async () => {
  expect(
    await overrides({
      'src/a.tsx': `import { MenuTrigger } from '@tc96/ui/menu'
export const A = () => <>
  <MenuTrigger className="rounded-sm hover:bg-accent" />
  <div className="rounded-full bg-muted" />
</>
`,
    }),
  ).toEqual([])
})

test('flags the style of another COSS component', async () => {
  expect(
    await overrides({
      'src/a.tsx': `import { Button, buttonVariants } from '@tc96/ui/button'
export const A = () => <Button className={buttonVariants()} />
`,
    }),
  ).toEqual(['Button coss:button.buttonVariants'])
})
