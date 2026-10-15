import { expect, test } from 'bun:test'
import { extractStory } from './story-source'

const stories = `import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { StarIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import { booleanArgType } from '../test-utils/story-arg-types'

const contrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

const meta = {
  argTypes: { disabled: booleanArgType },
  component: Button,
  parameters: { a11y: { test: 'todo' }, layout: 'centered' },
  title: 'UI/Button',
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

const labels = ['Save', 'Cancel']

function Starred() {
  return (
    <Button className="gap-2 px-3">
      <StarIcon className="size-4" />
      {labels[0]}
    </Button>
  )
}

const unused = <Badge>Unused</Badge>

function labelled(label: string): Story {
  return {
    args: { children: label },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText(label)).toBeVisible()
    },
  }
}

export const Default: Story = {
  argTypes: { size: { control: 'select' } },
  parameters: contrast,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeVisible()
  },
  render: () => <Starred />,
}

export const Wide: Story = {
  ...Default,
  parameters: { ...contrast, layout: 'padded' },
}

export const Factory = labelled('Save')

export const Reused: Story = {
  render: Default.render,
}
`

test('keeps the story, its local helpers and only the imports they use', () => {
  const code = extractStory(stories, 'Default')

  expect(code).toContain('function Starred()')
  expect(code).toContain("const labels = ['Save', 'Cancel']")
  expect(code).toContain('<StarIcon className="size-4" />')
  expect(code).toContain("import { StarIcon } from 'lucide-react'")
  expect(code).toContain("import { Button } from '@tc96/ui/button'")
  expect(code).not.toContain('unused')
  expect(code).not.toContain('@tc96/ui/badge')
  expect(code).not.toContain('function labelled')
})

test('strips play, argTypes and a11y parameters', () => {
  const code = extractStory(stories, 'Default')

  expect(code).not.toContain('play')
  expect(code).not.toContain('argTypes')
  expect(code).not.toContain('a11y')
  expect(code).not.toContain('const contrast')
  expect(code).not.toContain('storybook/test')
  expect(code).not.toContain('story-arg-types')
  expect(code).toContain("parameters: { layout: 'centered' }")
})

test('strips play from spread stories and story factories', () => {
  const wide = extractStory(stories, 'Wide')
  expect(wide).toContain('export const Default')
  expect(wide).toContain("parameters: { layout: 'padded' }")
  expect(wide).not.toContain('play')
  expect(wide).not.toContain('a11y')

  const factory = extractStory(stories, 'Factory')
  expect(factory).toContain('args: { children: label }')
  expect(factory).not.toContain('play')
  expect(factory).not.toContain('storybook/test')
})

test('strips play from stories referenced by property access', () => {
  const code = extractStory(stories, 'Reused')

  expect(code).toContain('export const Default')
  expect(code).toContain('render: Default.render')
  expect(code).not.toContain('play')
  expect(code).not.toContain('storybook/test')
})

test('fails on an unknown export', () => {
  expect(() => extractStory(stories, 'Missing')).toThrow(
    'export not found: Missing',
  )
})
