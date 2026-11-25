import type { Meta, StoryObj } from '@storybook/react-vite'
import type { AttachmentType } from '@tc96/ui/patterns'
import { AttachmentProperty, AttachmentsProperty } from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { AttachmentsCanvas } from './attachments-canvas.tsx'
import { attachmentsControlArgs } from './attachments-controls.ts'
import { meetingMaterial } from './attachments-data.ts'
import { ComposedAttachments } from './attachments-layouts.tsx'

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
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        type="pdf"
        labels={ptBRPropertyLabels.attachment}
      />
    </AttachmentsProperty>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Behavior',
} satisfies Meta<AttachmentsBehaviorArgs>

export default meta

type Story = StoryObj<AttachmentsBehaviorArgs>

const typeIcons = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<SVGElement>(
    '[data-slot="attachment-type-icon"]',
  ),
]

const colorOfClass = (canvasElement: HTMLElement, className: string) => {
  const probe = document.createElement('span')
  probe.className = className
  canvasElement.append(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

async function expectIconsInTone(
  canvasElement: HTMLElement,
  type: AttachmentType,
  toneClassName: string,
) {
  const icons = typeIcons(canvasElement)
  const tone = colorOfClass(canvasElement, toneClassName)

  await expect(tone).not.toBe(
    colorOfClass(canvasElement, 'text-destructive-foreground'),
  )
  await expect(icons).toHaveLength(2)
  for (const icon of icons) {
    await expect(icon).toHaveAttribute('data-attachment-type', type)
    await expect(getComputedStyle(icon).color).toBe(tone)
  }
}

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
        type="pdf"
        labels={{
          ...ptBRPropertyLabels.attachment,
          remove: 'Remover Contrato.pdf',
        }}
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
        labels={ptBRPropertyLabels.attachment}
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
        type="pdf"
        labels={{
          ...ptBRPropertyLabels.attachment,
          remove: 'Remover Proposta comercial.pdf',
        }}
      />
      <AttachmentProperty
        href="#gravacao"
        label="Gravação da reunião"
        onRemove={() => undefined}
        type="link"
        labels={{
          ...ptBRPropertyLabels.attachment,
          remove: 'Remover Gravação da reunião',
        }}
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
          type={item.type}
          labels={{
            ...ptBRPropertyLabels.attachment,
            remove: `Remover ${item.label}`,
          }}
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
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        type="pdf"
        labels={ptBRPropertyLabels.attachment}
      />
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
      <AttachmentProperty
        href="#contrato"
        label="Contrato.pdf"
        type="pdf"
        labels={ptBRPropertyLabels.attachment}
      />
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

export const RemoveOffLeavesLinksAndAddTrigger: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} remove={false} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('link')).toHaveLength(2)
    await expect(canvas.queryByRole('button', { name: /^Remover / })).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    ).toBeVisible()
  },
}

export const ActionOffKeepsEveryRemove: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} action={false} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Anexar arquivo' }),
    ).toBeNull()
    await expect(
      canvas.getAllByRole('button', { name: /^Remover / }),
    ).toHaveLength(2)
  },
}

export const ReadOnlyRowHasOnlyLinks: Story = {
  render: () => <ComposedAttachments {...attachmentsControlArgs} readOnly />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('link')).toHaveLength(2)
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const TypeIconOffDrawsNoTypeIcon: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} typeIcon={false} />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('link')).toHaveLength(2)
    await expect(typeIcons(canvasElement)).toHaveLength(0)
  },
}

export const EmptyWithoutIconShowsOnlyTheLabel: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} actionIcon={false} empty />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Anexar arquivo',
    })

    await expect(trigger).toHaveTextContent(/^Anexar arquivo$/)
    await expect(trigger.querySelector('svg')).toBeNull()
  },
}

export const ActionDisabledDimsTheTrigger: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} actionDisabled />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Anexar arquivo',
    })

    await expect(trigger).toBeDisabled()
    await expect(getComputedStyle(trigger).opacity).toBe('0.64')
  },
}

export const TypeDocPaintsTheIconInInfo: Story = {
  render: () => <ComposedAttachments {...attachmentsControlArgs} type="doc" />,
  play: ({ canvasElement }) =>
    expectIconsInTone(canvasElement, 'doc', 'text-info-foreground'),
}

export const TypeAudioPaintsTheIconInWarning: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} type="audio" />
  ),
  play: ({ canvasElement }) =>
    expectIconsInTone(canvasElement, 'audio', 'text-warning-foreground'),
}

export const TypeLinkPaintsTheIconMuted: Story = {
  render: () => <ComposedAttachments {...attachmentsControlArgs} type="link" />,
  play: ({ canvasElement }) =>
    expectIconsInTone(canvasElement, 'link', 'text-muted-foreground'),
}
