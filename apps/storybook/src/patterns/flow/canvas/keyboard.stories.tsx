import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowCanvas,
  FlowCanvasControls,
  FlowShortcutsPopover,
} from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  twoSteps,
  twoStepsConnections,
  twoStepsTypes,
} from './fixtures/two-steps'

async function region(canvasElement: HTMLElement): Promise<HTMLElement> {
  const canvas = within(canvasElement)
  await canvas.findByRole('group', {
    name: 'Enviar e-mail, E-mail, Não executado',
  })
  return canvas.getByRole('region', { name: 'Canvas do fluxo' })
}

function appendField<T extends HTMLElement>(parent: HTMLElement, field: T): T {
  field.setAttribute('aria-label', 'Campo de teste')
  parent.append(field)
  return field
}

const meta = {
  args: {
    className: 'h-96 rounded-xl border',
    connections: twoStepsConnections,
    onStepAction: fn(),
    stepTypes: twoStepsTypes,
    steps: twoSteps,
  },
  component: FlowCanvas,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Keyboard',
} satisfies Meta<typeof FlowCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const BackspaceDeletesSelectedStep: Story = {
  args: { selectedStepId: 'mail' },
  play: async ({ args, canvasElement }) => {
    const section = await region(canvasElement)
    const input = appendField(section, document.createElement('input'))

    input.focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onStepAction).not.toHaveBeenCalled()
    input.remove()

    section.focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onStepAction).toHaveBeenCalledWith('delete', 'mail')
  },
}

export const BackspaceKeepsTrigger: Story = {
  args: { selectedStepId: 'form' },
  play: async ({ args, canvasElement }) => {
    const section = await region(canvasElement)
    section.focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onStepAction).not.toHaveBeenCalled()
  },
}

export const VAndHSwitchMode: Story = {
  play: async ({ canvasElement }) => {
    const section = await region(canvasElement)
    const textarea = appendField(section, document.createElement('textarea'))

    textarea.focus()
    await userEvent.keyboard('h')
    await expect(section).toHaveAttribute('data-mode', 'select')
    textarea.remove()

    section.focus()
    await userEvent.keyboard('h')
    await expect(section).toHaveAttribute('data-mode', 'pan')
    await userEvent.keyboard('v')
    await expect(section).toHaveAttribute('data-mode', 'select')
  },
}

export const IgnoresKeysFromOutsideCanvas: Story = {
  play: async ({ canvasElement }) => {
    const section = await region(canvasElement)
    await userEvent.click(
      within(section).getByRole('button', { name: 'Atalhos de teclado' }),
    )
    const popup = await screen.findByRole('dialog', {
      name: 'Atalhos de teclado',
    })
    await waitFor(() =>
      expect(popup.contains(document.activeElement)).toBe(true),
    )
    await expect(section.contains(document.activeElement)).toBe(false)

    await userEvent.keyboard('h')
    await expect(section).toHaveAttribute('data-mode', 'select')
  },
  render: (args) => (
    <FlowCanvas {...args}>
      <FlowCanvasControls>
        <FlowShortcutsPopover />
      </FlowCanvasControls>
    </FlowCanvas>
  ),
}

export const ShortcutsTriggerIsNamedButton: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Atalhos de teclado',
      }),
    ).toBeVisible()
  },
  render: () => <FlowShortcutsPopover />,
}
