import { expect, test } from 'bun:test'
import { formatTsx, storyComponent, storySnippets } from './story-component'

const stories = `import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { StarIcon } from 'lucide-react'
import { fn } from 'storybook/test'

const meta = {
  args: { onClick: fn(), size: 'sm' },
  component: Button,
  decorators: [(Story) => <div className="p-6"><Story /></div>],
  title: 'UI/Button',
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

const label = 'Save'

function Starred() {
  return (
    <Button className="gap-2 px-3">
      <StarIcon className="size-4" />
      {label}
    </Button>
  )
}

export const Default: Story = {
  args: { children: 'Continue', disabled: true, variant: 'outline' },
}

export const Custom: Story = {
  render: () => <Starred />,
}

export const Spread: Story = {
  args: { variant: 'ghost' },
  render: (args) => <Button {...args} size="lg">{args.variant}</Button>,
}

export const Destructured: Story = {
  args: { variant: 'ghost' },
  render: ({ variant }) => <Badge variant={variant}>{variant}</Badge>,
}

export const UsesMeta: Story = {
  render: () => <Button>{meta.title}</Button>,
}
`

test('turns args into props on the meta component', () => {
  expect(
    storyComponent(stories, 'Default'),
  ).toBe(`import { Button } from '@tc96/ui/button'

export default function Default() {
return <Button onClick={() => {}} size="sm" disabled variant="outline">Continue</Button>
}`)
})

test('keeps the render body with its local helpers and drops decorators', () => {
  const code = storyComponent(stories, 'Custom') as string

  expect(code).toContain('function Starred()')
  expect(code).toContain("const label = 'Save'")
  expect(code).toContain("import { StarIcon } from 'lucide-react'")
  expect(code).toContain(
    'export default function Custom() {\nreturn (<Starred />)\n}',
  )
  expect(code).not.toContain('p-6')
  expect(code).not.toContain('storybook')
})

test('inlines args into spreads, member reads and destructured params', () => {
  expect(storyComponent(stories, 'Spread')).toContain(
    `return (<Button onClick={() => {}} variant="ghost" size="lg">{'ghost'}</Button>)`,
  )
  expect(storyComponent(stories, 'Destructured')).toContain(
    `return (<Badge variant={'ghost'}>{'ghost'}</Badge>)`,
  )
})

test('falls back to the story module when the render needs meta', () => {
  expect(storyComponent(stories, 'UsesMeta')).toBeUndefined()
  const [snippet] = storySnippets(stories, ['UsesMeta'])
  expect(snippet).toContain('export const UsesMeta')
  expect(snippet).toContain('export default meta')
})

test('formats each snippet with Biome', () => {
  const [code] = formatTsx([storyComponent(stories, 'Default') as string])
  expect(code).toBe(`import { Button } from '@tc96/ui/button'

export default function Default() {
  return (
    <Button onClick={() => {}} size="sm" disabled variant="outline">
      Continue
    </Button>
  )
}
`)
})
