import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentProperty, AttachmentsProperty } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onRemove = fn()

const contract = (
  <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
)

const meta = {
  args: { ariaLabel: 'Arquivos' },
  component: AttachmentsProperty,
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-xl items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Behavior',
} satisfies Meta<typeof AttachmentsProperty>

export default meta

type Story = StoryObj<typeof meta>

export const NoRemoveWithoutOnRemove: Story = {
  args: { children: contract },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Remover/ }),
    ).toBeNull()
  },
}

export const RemoveIsSiblingOfLink: Story = {
  args: {
    children: (
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        onRemove={() => onRemove('contrato')}
        removeLabel="Remover Contrato.pdf"
        type="pdf"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    onRemove.mockClear()
    const remove = within(canvasElement).getByRole('button', {
      name: 'Remover Contrato.pdf',
    })

    await expect(remove.closest('a')).toBeNull()

    await userEvent.click(remove)
    await expect(onRemove).toHaveBeenCalledTimes(1)
    await expect(onRemove).toHaveBeenCalledWith('contrato')
  },
}

export const TypeOnLeftOnlyRemoveOnRight: Story = {
  args: {
    children: (
      <>
        <AttachmentProperty
          action="download"
          href="#proposta"
          label="Proposta comercial.pdf"
          onRemove={() => undefined}
          removeLabel="Remover Proposta comercial.pdf"
          type="pdf"
        />
        <AttachmentProperty
          href="#gravacao"
          label="Gravação da reunião"
          onRemove={() => undefined}
          removeLabel="Remover Gravação da reunião"
          type="link"
        />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const download = canvas.getByRole('link', {
      name: 'Proposta comercial.pdf',
    })
    const anchor = canvas.getByRole('link', { name: 'Gravação da reunião' })

    await expect(download.getAttribute('data-slot')).toBe(
      'attachment-property-link',
    )
    await expect(download.hasAttribute('download')).toBe(true)
    await expect(anchor.hasAttribute('download')).toBe(false)
    await expect(
      download
        .closest('[data-slot="attachment-property"]')
        ?.querySelector('[data-slot="attachment-type-icon"]')
        ?.getAttribute('data-attachment-type'),
    ).toBe('pdf')

    for (const chip of canvas.getAllByRole('link')) {
      const surface = chip.closest('[data-slot="attachment-property"]')
      await expect(
        surface?.querySelectorAll('[data-slot="attachment-property-remove"]'),
      ).toHaveLength(1)
    }
  },
}

export const ListsAttachments: Story = {
  args: { children: contract },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Contrato.pdf'),
    ).toBeInTheDocument()
  },
}

export const AddActionVisibleWithoutMenu: Story = {
  args: { action: { label: 'Anexar arquivo', onSelect: fn() } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    ).toBeInTheDocument()
    await expect(canvas.queryByRole('menu')).toBeNull()
  },
}

export const RunsActionOnFirstClick: Story = {
  args: {
    action: { label: 'Adicionar link', onSelect: fn() },
    ariaLabel: 'Links',
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar link' }),
    )

    await expect(args.action?.onSelect).toHaveBeenCalledTimes(1)
  },
}

export const ReadOnlyHidesAction: Story = {
  args: { children: contract },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const EmptyNamesActionInFull: Story = {
  args: { action: { label: 'Anexar arquivo', onSelect: fn() } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Anexar arquivo'),
    ).toBeInTheDocument()
  },
}

export const CollapsesToSingleSign: Story = {
  args: {
    action: { label: 'Anexar arquivo', onSelect: fn() },
    children: contract,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Anexar arquivo')).toBeNull()
    await expect(
      canvas.getAllByRole('button', { name: 'Anexar arquivo' }),
    ).toHaveLength(1)
  },
}

export const DisabledActionDoesNotRun: Story = {
  args: {
    action: { disabled: true, label: 'Enviando…', onSelect: fn() },
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviando…' }),
      { pointerEventsCheck: 0 },
    )

    await expect(args.action?.onSelect).not.toHaveBeenCalled()
  },
}
