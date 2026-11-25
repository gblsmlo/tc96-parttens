import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  expect,
  fn,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { TextCanvas } from './text-canvas.tsx'
import { textControlArgs } from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

interface BehaviorArgs {
  onCommit: (value: string | null) => void
}

const meta = {
  args: { onCommit: fn() },
  decorators: [TextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const surface = (canvasElement: HTMLElement) => {
  const found = canvasElement.querySelector<HTMLElement>(
    '[data-slot="property-surface"]',
  )
  if (!found) throw new Error('The story did not render the surface.')
  return found
}

const copyArgs = {
  ...textControlArgs,
  ariaLabel: 'E-mail',
  copyable: true,
  labelsCopy: 'Copiar e-mail do contato',
  value: 'mariana@exemplo.com',
}

export const BadgeSurfaceIsFilled: Story = {
  render: () => <ComposedText {...textControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute(
      'data-variant',
      'badge',
    )
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainSurfaceHasNoFill: Story = {
  render: () => <ComposedText {...textControlArgs} variant="plain" />,
  play: async ({ canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute(
      'data-variant',
      'plain',
    )
    await esperarSuperficiePlana(canvasElement)
    await expect(
      within(canvasElement).getByText('Solicitação de documento'),
    ).toBeVisible()
  },
}

export const AriaLabelNamesTheValue: Story = {
  render: () => <ComposedText {...textControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Tipo: Solicitação de documento',
      }),
    ).toHaveTextContent('Solicitação de documento')
  },
}

export const IconIsHiddenBeforeTheValue: Story = {
  render: () => <ComposedText {...textControlArgs} />,
  play: async ({ canvasElement }) => {
    const icon = surface(canvasElement).querySelector(
      '[data-slot="property-icon"]',
    )
    if (!icon) throw new Error('The story did not render the icon.')

    await expect(isInaccessible(icon)).toBe(true)
    await expect(
      icon.compareDocumentPosition(
        within(canvasElement).getByText('Solicitação de documento'),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const NoIconWithoutTheIcon: Story = {
  render: () => <ComposedText {...textControlArgs} icon={false} />,
  play: async ({ canvasElement }) => {
    await expect(
      surface(canvasElement).querySelector('[data-slot="property-icon"]'),
    ).toBeNull()
    await expect(surface(canvasElement).querySelector('svg')).toBeNull()
  },
}

export const EmptyValueShowsTheFallback: Story = {
  render: () => (
    <ComposedText {...textControlArgs} labelsFallback="Sem origem" value="" />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Sem origem')).toBeVisible()
    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')
  },
}

export const CopyButtonStaysReachableInGroup: Story = {
  render: () => <ComposedText {...copyArgs} />,
  play: async ({ canvasElement }) => {
    const copyButton = within(canvasElement).getByRole('button', {
      name: 'Copiar e-mail do contato',
    })

    await expect(copyButton).toBeVisible()
    await expect(surface(canvasElement)).toHaveAttribute('role', 'group')
    await userEvent.tab()
    await expect(copyButton).toHaveFocus()
  },
}

export const EmptyValueHasNoCopyButton: Story = {
  render: () => (
    <ComposedText {...copyArgs} labelsFallback="Sem e-mail" value="" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="text-property-copy"]'),
    ).toBeNull()
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const CopyOnHoverKeepsItsSpaceAndShowsOnFocus: Story = {
  render: () => <ComposedText {...copyArgs} trailingVisibility="hover" />,
  play: async ({ canvasElement }) => {
    const copyButton = within(canvasElement).getByRole('button', {
      name: 'Copiar e-mail do contato',
    })
    const affordance = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-trailing"]',
    )
    if (!affordance) throw new Error('The story did not render the trailing.')

    await expect(getComputedStyle(affordance).opacity).toBe('0')
    await expect(affordance.getBoundingClientRect().width).toBeGreaterThan(0)

    copyButton.focus()
    await waitFor(() => expect(getComputedStyle(affordance).opacity).toBe('1'))
  },
}

export const AddButtonFocusesField: Story = {
  render: ({ onCommit }) => (
    <ComposedText
      {...textControlArgs}
      ariaLabel="Documento"
      editing="trigger"
      labelsAdd="Adicionar documento"
      onCommit={onCommit}
      value=""
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Adicionar documento' }),
    )

    const field = canvas.getByRole('textbox', { name: 'Documento' })
    await expect(field).toHaveFocus()
    await expect(field).toHaveAttribute('data-editing')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const KeyboardOpensFieldFromAddButton: Story = {
  render: ({ onCommit }) => (
    <ComposedText
      {...textControlArgs}
      ariaLabel="Documento"
      editing="trigger"
      labelsFallback="Sem documento"
      onCommit={onCommit}
      value=""
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.tab()
    await expect(
      canvas.getByRole('button', { name: 'Sem documento' }),
    ).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    await expect(
      canvas.getByRole('textbox', { name: 'Documento' }),
    ).toHaveFocus()
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const FieldShowsInputPlaceholder: Story = {
  render: ({ onCommit }) => (
    <ComposedText
      {...textControlArgs}
      ariaLabel="Telefone"
      editing="trigger"
      labelsFallback="Sem telefone"
      labelsInputPlaceholder="+55 81 3333-0000"
      onCommit={onCommit}
      value=""
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Sem telefone' }))
    const field = await canvas.findByRole<HTMLInputElement>('textbox', {
      name: 'Telefone',
    })

    await expect(field).toBeVisible()
    await expect(field.placeholder).toBe('+55 81 3333-0000')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const InlineCommitsOnBlur: Story = {
  render: ({ onCommit }) => (
    <ComposedText
      {...copyArgs}
      editing="inline"
      labelsCopy="Copiar e-mail"
      onCommit={onCommit}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'E-mail',
    })

    await userEvent.clear(field)
    await userEvent.type(field, 'novo@exemplo.com')
    await expect(args.onCommit).not.toHaveBeenCalled()
    await userEvent.tab()

    await waitFor(() => expect(args.onCommit).toHaveBeenCalledOnce())
    await expect(args.onCommit).toHaveBeenLastCalledWith('novo@exemplo.com')
  },
}

export const InlineEditingTakesNoFocus: Story = {
  render: ({ onCommit }) => (
    <ComposedText
      {...textControlArgs}
      ariaLabel="Documento"
      editing="inline"
      onCommit={onCommit}
      value=""
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Documento' }),
    ).not.toHaveFocus()
    await expect(canvasElement.ownerDocument.activeElement).toBe(
      canvasElement.ownerDocument.body,
    )
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const DisabledShowsValueWithoutEditing: Story = {
  render: ({ onCommit }) => (
    <ComposedText
      {...textControlArgs}
      disabled
      editing="inline"
      labelsFallback="Sem origem"
      onCommit={onCommit}
      value=""
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Sem origem')).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}
