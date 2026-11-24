import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentProperty, AttachmentsProperty } from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { AttachmentsCanvas } from './attachments-canvas.tsx'
import { meetingMaterial } from './attachments-data.ts'

interface AttachmentsBehaviorArgs {
  onRemove: (id: string) => void
  onSelect: () => void
}

const meta = {
  args: {
    onRemove: fn((_id: string) => {}),
    onSelect: fn(),
  },
  decorators: [AttachmentsCanvas],
  render: () => (
    <AttachmentsProperty ariaLabel="Arquivos">
      <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
    </AttachmentsProperty>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Behavior',
} satisfies Meta<AttachmentsBehaviorArgs>

export default meta

type Story = StoryObj<AttachmentsBehaviorArgs>

export const ListsAttachments: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('group', { name: 'Arquivos' })).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Contrato.pdf' }),
    ).toBeVisible()
  },
}

export const NoRemoveWithoutOnRemove: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Remover/ }),
    ).toBeNull()
  },
}

export const ReadOnlyHidesAction: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const RemoveIsSiblingOfLink: Story = {
  render: ({ onRemove }) => (
    <AttachmentsProperty ariaLabel="Arquivos">
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        onRemove={() => onRemove('contrato')}
        removeLabel="Remover Contrato.pdf"
        type="pdf"
      />
    </AttachmentsProperty>
  ),
  play: async ({ args, canvasElement }) => {
    const remove = within(canvasElement).getByRole('button', {
      name: 'Remover Contrato.pdf',
    })

    await expect(remove.closest('a')).toBeNull()

    await userEvent.click(remove)
    await expect(args.onRemove).toHaveBeenCalledOnce()
    await expect(args.onRemove).toHaveBeenLastCalledWith('contrato')
  },
}

export const RemoveHasDefaultName: Story = {
  render: ({ onRemove }) => (
    <AttachmentsProperty ariaLabel="Arquivos">
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        onRemove={() => onRemove('contrato')}
      />
    </AttachmentsProperty>
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Remover anexo' }),
    )

    await expect(args.onRemove).toHaveBeenCalledOnce()
  },
}

export const TypeOnLeftOnlyRemoveOnRight: Story = {
  render: () => (
    <AttachmentsProperty ariaLabel="Arquivos">
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
    </AttachmentsProperty>
  ),
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

export const EveryTypeHasItsIcon: Story = {
  render: () => (
    <AttachmentsProperty ariaLabel="Material">
      {meetingMaterial.map((item) => (
        <AttachmentProperty
          action={item.action}
          href={item.href}
          key={item.id}
          label={item.label}
          onRemove={() => undefined}
          removeLabel={`Remove ${item.label}`}
          type={item.type}
        />
      ))}
    </AttachmentsProperty>
  ),
  play: async ({ canvasElement }) => {
    const types = [
      ...canvasElement.querySelectorAll('[data-slot="attachment-type-icon"]'),
    ].map((icon) => icon.getAttribute('data-attachment-type'))

    await expect(types).toEqual(['pdf', 'doc', 'audio', 'link'])
    await expect(canvasElement.querySelectorAll('a[download]')).toHaveLength(3)
    await expect(
      canvasElement.querySelectorAll(
        '[data-slot="attachment-property-remove"]',
      ),
    ).toHaveLength(4)
  },
}

export const AddActionVisibleWithoutMenu: Story = {
  render: ({ onSelect }) => (
    <AttachmentsProperty
      action={{ label: 'Anexar arquivo', onSelect }}
      ariaLabel="Arquivos"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('menu')).toBeNull()
    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}

export const RunsActionOnFirstClick: Story = {
  render: ({ onSelect }) => (
    <AttachmentsProperty
      action={{ label: 'Adicionar link', onSelect }}
      ariaLabel="Links"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar link' }),
    )

    await expect(args.onSelect).toHaveBeenCalledOnce()
  },
}

export const ActionReachableByKeyboard: Story = {
  render: ({ onSelect }) => (
    <AttachmentsProperty
      action={{ label: 'Anexar arquivo', onSelect }}
      ariaLabel="Arquivos"
    >
      <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
    </AttachmentsProperty>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.tab()
    await expect(
      canvas.getByRole('link', { name: 'Contrato.pdf' }),
    ).toHaveFocus()
    await userEvent.tab()
    await expect(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    ).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    await expect(args.onSelect).toHaveBeenCalledOnce()
  },
}

export const EmptyNamesActionInFull: Story = {
  render: ({ onSelect }) => (
    <AttachmentsProperty
      action={{ label: 'Anexar arquivo', onSelect }}
      ariaLabel="Arquivos"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Anexar arquivo' }),
    ).toHaveTextContent('Anexar arquivo')
    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}

export const CollapsesToSingleSign: Story = {
  render: ({ onSelect }) => (
    <AttachmentsProperty
      action={{ label: 'Anexar arquivo', onSelect }}
      ariaLabel="Arquivos"
    >
      <AttachmentProperty href="#contrato" label="Contrato.pdf" type="pdf" />
    </AttachmentsProperty>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const triggers = canvas.getAllByRole('button', { name: 'Anexar arquivo' })

    await expect(canvas.queryByText('Anexar arquivo')).toBeNull()
    await expect(triggers).toHaveLength(1)
    await expect(triggers[0]).toHaveTextContent(/^$/)
    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}

export const DisabledActionDoesNotRun: Story = {
  render: ({ onSelect }) => (
    <AttachmentsProperty
      action={{ disabled: true, label: 'Enviando…', onSelect }}
      ariaLabel="Arquivos"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Enviando…',
    })

    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })

    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}
