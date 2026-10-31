import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentsProperty, EmailProperty } from '@tc96/parttens'
import { PaperclipIcon } from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const onSelect = fn()

const glyphSize = (glyph: SVGElement | null | undefined) => {
  const box = glyph?.getBoundingClientRect()
  return { height: box?.height, width: box?.width }
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
  title: 'Patterns/Properties/Shared/Add Trigger',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const EmptyShowsPlaceholderAndNamesAction: Story = {
  render: () => <EmailProperty onValueChange={() => undefined} value={[]} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toBe('Sem e-mail')
    await expect(trigger.getAttribute('data-empty')).toBe('true')
    await expect(trigger.querySelector('svg')).not.toBeNull()
  },
}

export const EmptyGlyphMatchesEmptyChips: Story = {
  render: () => <EmailProperty onValueChange={() => undefined} value={[]} />,
  play: async ({ canvasElement }) => {
    const glyph = within(canvasElement)
      .getByRole('button', { name: 'Adicionar e-mail' })
      .querySelector('svg')

    await expect(glyph?.classList.contains('size-3')).toBe(true)
    await expect(glyph?.classList.contains('size-3.5')).toBe(false)
    await expect(glyphSize(glyph)).toEqual({ height: 12, width: 12 })
  },
}

export const WithValueCollapsesToSign: Story = {
  render: () => (
    <EmailProperty
      onValueChange={() => undefined}
      value={['ana@example.com']}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toBe('')
    await expect(trigger.getAttribute('data-empty')).toBeNull()
    await expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    await expect(glyphSize(trigger.querySelector('svg'))).toEqual({
      height: 14,
      width: 14,
    })
  },
}

export const MutedCanBeOverridden: Story = {
  render: () => (
    <AttachmentsProperty
      action={{ icon: PaperclipIcon, label: 'Anexar', onSelect: () => {} }}
      ariaLabel="Anexos"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByRole('button', { name: 'Anexar' })
        .getAttribute('data-empty'),
    ).toBeNull()
  },
}

export const ForwardsTriggerProps: Story = {
  render: () => <EmailProperty onValueChange={() => undefined} value={[]} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    await expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', {
      name: 'Adicionar e-mail',
    })
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const RunsOnClickUnlessDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <AttachmentsProperty
        action={{ icon: PaperclipIcon, label: 'Anexar arquivo', onSelect }}
        ariaLabel="Anexos"
      />
      <AttachmentsProperty
        action={{
          disabled: true,
          icon: PaperclipIcon,
          label: 'Anexar link',
          onSelect,
        }}
        ariaLabel="Links"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    onSelect.mockClear()
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    )
    await expect(onSelect).toHaveBeenCalledTimes(1)

    const disabled = canvas.getByRole('button', { name: 'Anexar link' })
    await expect(disabled).toBeDisabled()
    await userEvent.click(disabled, { pointerEventsCheck: 0 })
    await expect(onSelect).toHaveBeenCalledTimes(1)
  },
}
