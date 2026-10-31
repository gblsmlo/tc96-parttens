import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty, PropertyCollection, TagsProperty } from '@tc96/parttens'
import { expect } from 'storybook/test'

const tagOptions = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
] as const

const row = (canvasElement: HTMLElement, slot: string): HTMLFieldSetElement => {
  const found = canvasElement.querySelector<HTMLFieldSetElement>(
    `fieldset[data-slot="${slot}"]`,
  )
  if (!found) throw new Error(`No fieldset[data-slot="${slot}"] rendered.`)
  return found
}

const meta = {
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Shared/Row',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NamedFieldsetWithSlotAndVariant: Story = {
  render: () => (
    <TagsProperty
      ariaLabel="Tags"
      options={tagOptions}
      readOnly
      value={['documents', 'return']}
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = row(canvasElement, 'tags-property')

    await expect(fieldset.getAttribute('aria-label')).toBe('Tags')
    await expect(fieldset.dataset.slot).toBe('tags-property')
    await expect(fieldset.dataset.variant).toBe('plain')
    await expect(fieldset.textContent).toBe('DocumentosRetorno')
  },
}

export const ResetsChromeAndKeepsLayout: Story = {
  render: () => (
    <TagsProperty
      ariaLabel="Tags"
      options={tagOptions}
      readOnly
      value={['documents']}
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = row(canvasElement, 'tags-property')
    const style = getComputedStyle(fieldset)

    for (const token of [
      'm-0',
      'min-w-0',
      'border-0',
      'p-0',
      'flex',
      'gap-1',
    ]) {
      await expect(fieldset.classList.contains(token)).toBe(true)
    }
    await expect(style.margin).toBe('0px')
    await expect(style.minWidth).toBe('0px')
    await expect(style.borderWidth).toBe('0px')
    await expect(style.padding).toBe('0px')
    await expect(style.display).toBe('flex')
    await expect(style.columnGap).toBe('4px')
  },
}

export const CallerOverridesReset: Story = {
  render: () => (
    <TagsProperty
      ariaLabel="Tags"
      className="min-w-fit"
      options={tagOptions}
      readOnly
      value={['documents']}
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = row(canvasElement, 'tags-property')

    await expect(fieldset.classList.contains('min-w-fit')).toBe(true)
    await expect(fieldset.classList.contains('min-w-0')).toBe(false)
    await expect(getComputedStyle(fieldset).minWidth).toBe('fit-content')
  },
}

export const OmitsVariantAndLabel: Story = {
  render: () => (
    <PropertyCollection
      items={[
        {
          defaultVisible: true,
          id: 'status',
          label: 'Status',
          render: () => <span>Em progresso</span>,
        },
      ]}
      readOnly
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = row(canvasElement, 'property-collection')

    await expect(fieldset.hasAttribute('data-variant')).toBe(false)
    await expect(fieldset.hasAttribute('aria-label')).toBe(false)
  },
}

export const PassesDataAttributes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TagsProperty
        display="count"
        options={tagOptions}
        readOnly
        value={['documents']}
      />
      <EmailProperty
        editing="inline"
        onValueChange={() => undefined}
        value={['ana@example.com']}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(row(canvasElement, 'tags-property').dataset.display).toBe(
      'count',
    )
    await expect(row(canvasElement, 'email-property').dataset.editing).toBe(
      'inline',
    )
  },
}
