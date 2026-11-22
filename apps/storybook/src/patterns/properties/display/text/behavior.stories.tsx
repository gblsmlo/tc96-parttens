import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/parttens'
import { MailIcon } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { TextCanvas } from './text-canvas.tsx'

const meta = {
  args: { ariaLabel: 'Origem', value: 'Manual' },
  component: TextProperty,
  decorators: [TextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Behavior',
} satisfies Meta<typeof TextProperty>

export default meta

type Story = StoryObj<typeof meta>

const surface = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="property-surface"]')

const copyArgs = {
  ariaLabel: 'E-mail',
  copyLabel: 'Copiar e-mail do contato',
  icon: MailIcon,
  value: 'mariana@exemplo.com',
}

export const BadgeSurfaceIsFilled: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainSurfaceHasNoFill: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
    await expect(within(canvasElement).getByText('Manual')).toBeVisible()
  },
}

export const AriaLabelNamesTheValue: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Origem: Manual' }),
    ).toHaveTextContent('Manual')
  },
}

export const FallbackWhenEmpty: Story = {
  args: { fallback: 'Sem origem', value: null },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Sem origem')).toBeVisible()
    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')
  },
}

export const CopyButtonStaysReachableInGroup: Story = {
  args: copyArgs,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Copiar e-mail do contato',
      }),
    ).toBeVisible()
    await expect(surface(canvasElement)).toHaveAttribute('role', 'group')
  },
}

export const EmptyValueHasNoCopyButton: Story = {
  args: { ...copyArgs, fallback: 'Sem e-mail', value: null },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="text-property-copy"]'),
    ).toBeNull()
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const CopyOnHoverKeepsItsSpaceAndShowsOnFocus: Story = {
  args: { ...copyArgs, trailingVisibility: 'hover' },
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
  args: {
    addLabel: 'Adicionar documento',
    ariaLabel: 'Documento',
    onCommit: fn(),
    value: null,
  },
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
  args: {
    ariaLabel: 'Documento',
    fallback: 'Sem documento',
    onCommit: fn(),
    value: null,
  },
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
  args: {
    ariaLabel: 'Telefone',
    fallback: 'Sem telefone',
    inputPlaceholder: '+55 81 3333-0000',
    onCommit: fn(),
    value: null,
  },
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
  args: {
    ...copyArgs,
    copyLabel: undefined,
    editing: 'inline',
    onCommit: fn(),
  },
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
  args: {
    ariaLabel: 'Documento',
    editing: 'inline',
    onCommit: fn(),
    value: null,
  },
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
  args: {
    disabled: true,
    editing: 'inline',
    fallback: 'Sem origem',
    onCommit: fn(),
    value: null,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Sem origem')).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}
