import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowCanvas, type FlowCanvasProps } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  twoSteps,
  twoStepsConnections,
  twoStepsTypes,
} from './fixtures/two-steps'

function LockableCanvas(args: Readonly<FlowCanvasProps>) {
  const [locked, setLocked] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <Button className="self-start" onClick={() => setLocked(true)}>
        Travar canvas
      </Button>
      <FlowCanvas {...args} locked={locked} />
    </div>
  )
}

const meta = {
  args: {
    className: 'h-96 rounded-xl border',
    connections: twoStepsConnections,
    stepTypes: twoStepsTypes,
    steps: twoSteps,
  },
  component: FlowCanvas,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Lock',
} satisfies Meta<typeof FlowCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const DisablesMutatingControls: Story = {
  args: { direction: 'vertical', locked: true, selectedStepId: 'mail' },
  play: async () => {
    const button = async (name: string) =>
      (await screen.findAllByRole('button', { name }))[0]

    await expect(await button('Excluir Enviar e-mail')).toBeDisabled()
    await expect(await button('Duplicar Enviar e-mail')).toBeDisabled()
    await expect(
      await button('Adicionar um passo depois de Enviar e-mail'),
    ).toBeDisabled()
    await expect(await button('Editar Enviar e-mail')).toBeEnabled()
    await expect(await button('Ver Enviar e-mail')).toBeEnabled()
    await expect(await button('Adicionar um passo aqui')).toBeDisabled()
    await expect(await button('Remover esta conexão')).toBeDisabled()
  },
}

export const LockForcesSelectMode: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole('group', {
      name: 'Enviar e-mail, E-mail, Não executado',
    })
    const region = canvas.getByRole('region', { name: 'Canvas do fluxo' })

    region.focus()
    await userEvent.keyboard('h')
    await expect(region).toHaveAttribute('data-mode', 'pan')

    await userEvent.click(canvas.getByRole('button', { name: 'Travar canvas' }))
    await expect(region).toHaveAttribute('data-mode', 'select')
  },
  render: (args) => <LockableCanvas {...args} />,
}
