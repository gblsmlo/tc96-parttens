import { expect, test } from 'bun:test'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  formatTsx,
  inlineLimit,
  storyComponent,
  storySnippets,
} from './story-component'

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

function fixtureStory(files: Record<string, string>, story: string) {
  const dir = mkdtempSync(join(tmpdir(), 'story-component-'))
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content)
  }
  const file = join(dir, 'demo.stories.tsx')
  writeFileSync(file, story)
  return (name: string) => storyComponent(story, name, file)
}

const demoStory = `import type { Meta, StoryObj } from '@storybook/react-vite'
import { Demo } from './demo'

const meta = { title: 'Demo' } satisfies Meta

export default meta

export const Default: StoryObj = { render: () => <Demo /> }
`

test('inlines small relative fixtures with their own imports', () => {
  const component = fixtureStory(
    {
      'data.ts': "export const label = 'Save'\nexport const unused = 1\n",
      'demo.tsx': `import { Button } from '@tc96/ui/button'
import { label } from './data'

export function Demo() {
  return <Button>{label}</Button>
}
`,
    },
    demoStory,
  )
  const code = component('Default') as string

  expect(code).toBe(`import { Button } from '@tc96/ui/button'

const label = 'Save'

function Demo() {
  return <Button>{label}</Button>
}

export default function Default() {
return (<Demo />)
}`)
})

test('keeps the relative import when the fixture is too long', () => {
  const rows = Array.from({ length: inlineLimit }, (_, i) => `  ${i},`)
  const component = fixtureStory(
    {
      'demo.tsx': `const rows = [\n${rows.join('\n')}\n]\n\nexport function Demo() {\n  return <p>{rows.length}</p>\n}\n`,
    },
    demoStory,
  )

  expect(component('Default')).toContain("import { Demo } from './demo'")
})

test('inlines a long fixture when the story raises the limit', () => {
  const rows = Array.from({ length: inlineLimit }, (_, i) => `  ${i},`)
  const component = fixtureStory(
    {
      'demo.tsx': `const rows = [\n${rows.join('\n')}\n]\n\nexport function Demo() {\n  return <p>{rows.length}</p>\n}\n`,
    },
    demoStory.replace(
      "{ title: 'Demo' }",
      `{ parameters: { docs: { source: { inlineLimit: ${inlineLimit + 10} } } }, title: 'Demo' }`,
    ),
  )
  const code = component('Default') as string

  expect(code).not.toContain("from './demo'")
  expect(code).toContain('function Demo()')
})

test('keeps the relative import when an inlined name collides', () => {
  const component = fixtureStory(
    {
      'demo.tsx': `import { Button } from '@tc96/ui/button'

const Text = Button

export function Demo() {
  return <Text />
}
`,
    },
    demoStory
      .replace(
        "import { Demo } from './demo'",
        "import { Text } from '@tc96/elements/text'\nimport { Demo } from './demo'",
      )
      .replace('<Demo />', '<><Text /><Demo /></>'),
  )

  expect(component('Default')).toContain("import { Demo } from './demo'")
})

const slots = `import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Row } from '@tc96/parttens'
import { useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  args: {
    children: (
      <>
        <Row label="Type" />
        <Row label="Owner" />
      </>
    ),
    title: 'Details',
  },
  component: Group,
} satisfies Meta<typeof Group>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Toggle: Story = {
  render: function Toggle(args) {
    const [open, setOpen] = useState(true)
    return (
      <Group {...args} onOpenChange={setOpen} open={open}>
        {args.children}
      </Group>
    )
  },
}

export const Rest: StoryObj<{
  onSave: (value: string) => void
  title: string
}> = {
  args: { onSave: fn((_value: string) => {}), title: 'Details' },
  render: function Rest({ onSave, ...args }) {
    const [open, setOpen] = useState(true)
    return (
      <Group {...args} onOpenChange={(next) => { setOpen(next); onSave?.('x') }} open={open}>
        {args.title}
      </Group>
    )
  },
}

export const Handlers: StoryObj<{ onSave: (value: string) => void }> = {
  args: { onSave: fn(async (_value: string) => {}) },
  render: function Handlers({ onSave }) {
    return <button onClick={() => onSave('a')} type="button" />
  },
}
`

test('prints a JSX children arg as children', () => {
  const code = storyComponent(slots, 'Default') as string

  expect(code).toContain('<Group title="Details">')
  expect(code).toContain('<Row label="Type" />')
  expect(code).not.toContain('{<>')
  expect(code).not.toContain('children=')
})

test('replaces a children member read with the JSX it holds', () => {
  const code = storyComponent(slots, 'Toggle') as string

  expect(code).toContain('<Row label="Owner" />')
  expect(code).not.toContain('args')
  expect(code).not.toContain('children=')
})

test('declares fn handlers at the top and drops storybook/test', () => {
  const code = storyComponent(slots, 'Handlers') as string

  expect(code).toContain('const onSave = async (_value: string) => {}')
  expect(code).toContain("onClick={() => onSave('a')}")
  expect(code).not.toContain('fn(')
  expect(code).not.toContain('storybook')
})

test('spreads the rest of destructured args as props', () => {
  const code = storyComponent(slots, 'Rest') as string

  expect(code).toContain('const onSave = (_value: string) => {}')
  expect(code).toContain('<Group')
  expect(code).toContain('title="Details"')
  expect(code).toContain("onSave?.('x')")
  expect(code).toContain("{'Details'}")
  expect(code).not.toContain('args')
  expect(code).not.toContain('storybook')
})
