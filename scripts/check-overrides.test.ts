import { afterEach, expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { classify, findOverrides, styledElements } from './check-overrides'

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
  const found = await findOverrides([join(root, 'src')], join(root, 'ui'), {
    [join(root, 'src/elements/card-surface.tsx')]: ['CardSurface'],
  })
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

const surface = `export function CardSurface({ className }) {
  return <div className={cn("rounded-lg", className)} data-slot="card" />
}`

test('treats CardSurface as a styled component: radius, border, shadow and color need an exception', async () => {
  expect(
    await overrides({
      'src/elements/card-surface.tsx': surface,
      'src/a.tsx': `import { CardSurface } from './elements/card-surface'
export const A = () => <>
  <CardSurface className="min-w-0 border-transparent" />
  <CardSurface className="rounded-2xl border-border shadow-md bg-muted" />
  <CardSurface className={cn('p-4', '[--card-radius:1rem]')} />
</>
`,
    }),
  ).toEqual([
    'CardSurface rounded-2xl',
    'CardSurface border-border',
    'CardSurface shadow-md',
    'CardSurface bg-muted',
  ])
})

test('CardSurface checks follow a renamed import, a parent-relative path and ignore other modules', async () => {
  expect(
    await overrides({
      'src/elements/card-surface.tsx': surface,
      'src/elements/icon-frame.tsx': 'export const IconFrame = () => null',
      'src/deep/a.tsx': `import { CardSurface as Surface } from '../elements/card-surface'
import { IconFrame } from '../elements/icon-frame'
export const A = () => <>
  <Surface className="rounded-full" />
  <IconFrame className="rounded-full bg-muted" />
</>
`,
    }),
  ).toEqual(['Surface rounded-full'])
})

test('documents the limit: a barrel re-export of CardSurface is not followed', async () => {
  expect(
    await overrides({
      'src/elements/card-surface.tsx': surface,
      'src/elements/index.ts': "export { CardSurface } from './card-surface'",
      'src/a.tsx': `import { CardSurface } from './elements'
export const A = () => <CardSurface className="rounded-full" />
`,
    }),
  ).toEqual([])
})

test('every styled element module exports the names the check lists', async () => {
  for (const [path, names] of Object.entries(styledElements)) {
    const source = await readFile(path, 'utf8')
    for (const name of names)
      expect(source).toMatch(
        new RegExp(`export (?:async )?(?:function|const|class) ${name}\\b`),
      )
  }
})
