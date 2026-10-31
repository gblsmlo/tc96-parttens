import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FLOW_STEP_TRANSFER_TYPE,
  type FlowStepGroup,
  FlowStepLibrary,
  type FlowStepType,
  parseStepTransfer,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const sendEmail: FlowStepType = {
  description: 'Envia uma mensagem por e-mail',
  group: 'Mensagens',
  id: 'send-email',
  kind: 'action',
  label: 'Enviar e-mail',
}
const readRecord: FlowStepType = {
  group: 'Dados',
  id: 'read-record',
  kind: 'trigger',
  label: 'Ler registro',
}

const groups: FlowStepGroup[] = [
  { label: 'Mensagens', types: [sendEmail] },
  { label: 'Dados', types: [readRecord] },
]

const meta = {
  args: {
    className: 'h-[32rem] w-72 rounded-xl border',
    groups,
    onAdd: fn(),
  },
  component: FlowStepLibrary,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Panel',
} satisfies Meta<typeof FlowStepLibrary>

export default meta
type Story = StoryObj<typeof meta>

export const GroupsOfDraggableButtons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const messages = canvas.getByRole('group', { name: 'Mensagens' })
    const item = within(messages).getByRole('button', {
      name: 'Enviar e-mail',
    })
    await expect(item).toHaveAttribute('draggable', 'true')
    await expect(canvas.getByRole('group', { name: 'Dados' })).toBeVisible()
    await expect(item).toHaveAttribute('aria-describedby')
  },
}

export const ClickCallsOnAdd: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ler registro' }),
    )
    await expect(args.onAdd).toHaveBeenCalledWith(readRecord)
  },
}

export const DragStartWritesStepType: Story = {
  play: async ({ canvasElement }) => {
    const dataTransfer = new DataTransfer()
    let effectAllowed = 'all'
    Object.defineProperty(dataTransfer, 'effectAllowed', {
      get: () => effectAllowed,
      set: (value: string) => {
        effectAllowed = value
      },
    })
    within(canvasElement)
      .getByRole('button', { name: 'Enviar e-mail' })
      .dispatchEvent(
        new DragEvent('dragstart', {
          bubbles: true,
          cancelable: true,
          dataTransfer,
        }),
      )
    await expect(
      parseStepTransfer(dataTransfer.getData(FLOW_STEP_TRANSFER_TYPE)),
    ).toEqual(sendEmail)
    await expect(dataTransfer.getData('text/plain')).toBe('Enviar e-mail')
    await expect(effectAllowed).toBe('copy')
  },
}

export const LoadingShowsSkeletons: Story = {
  args: { groups: [], loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Passos' }),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0)
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const EmptyWithoutGroups: Story = {
  args: { groups: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum passo disponível')).toBeVisible()
    await expect(canvas.queryByRole('group')).toBeNull()
  },
}

export const FooterAndLabels: Story = {
  args: {
    children: <p>Última execução</p>,
    labels: { hint: 'Dica', title: 'Biblioteca' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Biblioteca' }),
    ).toBeVisible()
    await expect(canvas.getByText('Dica', { selector: 'p' }).id).not.toBe('')
    await expect(
      canvasElement.querySelector('[data-slot="flow-step-library-footer"]')
        ?.textContent,
    ).toBe('Última execução')
  },
}
