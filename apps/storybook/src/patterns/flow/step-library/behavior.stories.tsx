import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FLOW_STEP_TRANSFER_TYPE,
  FlowRunCard,
  type FlowStepGroup,
  FlowStepLibrary,
  FlowStepLibraryItem,
  type FlowStepType,
  parseStepTransfer,
} from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { EditorFrame, PartFrame } from './step-library-frame.tsx'

interface BehaviorArgs {
  onAdd: (type: FlowStepType) => void
}

const meta = {
  args: { onAdd: fn() },
  argTypes: { onAdd: { control: false } },
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

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

const item = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Enviar e-mail' })

export const GroupsOfDraggableButtons: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => <FlowStepLibrary groups={groups} onAdd={onAdd} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('group').map((group) => group.textContent),
    ).toEqual([
      'MensagensEnviar e-mailEnvia uma mensagem por e-mail',
      'DadosLer registro',
    ])
    const messages = canvas.getByRole('group', { name: 'Mensagens' })
    await expect(
      within(messages).getByRole('button', { name: 'Enviar e-mail' }),
    ).toHaveAttribute('draggable', 'true')
    await expect(
      within(canvas.getByRole('group', { name: 'Dados' })).getByRole('button', {
        name: 'Ler registro',
      }),
    ).toHaveAttribute('draggable', 'true')
  },
}

export const ClickCallsOnAdd: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => <FlowStepLibrary groups={groups} onAdd={onAdd} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ler registro' }),
    )
    await expect(args.onAdd).toHaveBeenCalledOnce()
    await expect(args.onAdd).toHaveBeenLastCalledWith(readRecord)
  },
}

export const KeyboardAddsStep: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => <FlowStepLibrary groups={groups} onAdd={onAdd} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const tabTo = async (target: Element) => {
      for (
        let step = 0;
        step < 10 && document.activeElement !== target;
        step += 1
      )
        await userEvent.tab()
      await expect(target).toHaveFocus()
    }

    await tabTo(canvas.getByRole('button', { name: 'Enviar e-mail' }))
    await userEvent.keyboard('{Enter}')
    await expect(args.onAdd).toHaveBeenCalledOnce()
    await expect(args.onAdd).toHaveBeenLastCalledWith(sendEmail)

    await tabTo(canvas.getByRole('button', { name: 'Ler registro' }))
    await userEvent.keyboard(' ')
    await expect(args.onAdd).toHaveBeenCalledTimes(2)
    await expect(args.onAdd).toHaveBeenLastCalledWith(readRecord)
  },
}

export const DragStartWritesStepType: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => <FlowStepLibrary groups={groups} onAdd={onAdd} />,
  play: async ({ args, canvasElement }) => {
    const dataTransfer = new DataTransfer()
    let effectAllowed = 'all'
    Object.defineProperty(dataTransfer, 'effectAllowed', {
      get: () => effectAllowed,
      set: (value: string) => {
        effectAllowed = value
      },
    })
    item(canvasElement).dispatchEvent(
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
    await expect(args.onAdd).not.toHaveBeenCalled()
  },
}

export const LoadingShowsSkeletons: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => <FlowStepLibrary groups={[]} loading onAdd={onAdd} />,
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
  decorators: [EditorFrame],
  render: ({ onAdd }) => <FlowStepLibrary groups={[]} onAdd={onAdd} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum passo disponível')).toBeVisible()
    await expect(canvas.queryByRole('group')).toBeNull()
  },
}

export const LabelsNameAndDescribePanel: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => (
    <FlowStepLibrary
      groups={groups}
      labels={{ hint: 'Dica', title: 'Biblioteca' }}
      onAdd={onAdd}
    />
  ),
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('region', {
      name: 'Biblioteca',
    })
    await expect(panel).toHaveAccessibleDescription('Dica')
    await expect(
      within(panel).getByRole('heading', { level: 2, name: 'Biblioteca' }),
    ).toBeVisible()
  },
}

export const ChildrenFillFooter: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => (
    <FlowStepLibrary groups={groups} onAdd={onAdd}>
      <p>Última execução</p>
    </FlowStepLibrary>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="flow-step-library-footer"]')
        ?.textContent,
    ).toBe('Última execução')
  },
}

export const CollapsedKeepsNames: Story = {
  decorators: [EditorFrame],
  render: ({ onAdd }) => (
    <FlowStepLibrary collapsed groups={groups} onAdd={onAdd} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const panel = canvas.getByRole('region', { name: 'Passos' })
    await expect(panel).toHaveAttribute('data-collapsed', 'true')
    await expect(panel).not.toHaveAttribute('aria-describedby')
    await expect(
      within(canvas.getByRole('group', { name: 'Mensagens' })).getByRole(
        'button',
        { name: 'Enviar e-mail' },
      ),
    ).toBeVisible()
    await expect(canvas.queryByText('Envia uma mensagem por e-mail')).toBeNull()
  },
}

export const ItemDescribedByDescription: Story = {
  decorators: [PartFrame],
  render: ({ onAdd }) => <FlowStepLibraryItem onAdd={onAdd} type={sendEmail} />,
  play: async ({ canvasElement }) => {
    const button = item(canvasElement)
    await expect(button).toHaveAccessibleDescription(
      'Envia uma mensagem por e-mail',
    )
    const id = button.getAttribute('aria-describedby')
    await expect(document.getElementById(id as string)?.textContent).toBe(
      'Envia uma mensagem por e-mail',
    )
  },
}

export const CollapsedItemDropsDescription: Story = {
  decorators: [PartFrame],
  render: ({ onAdd }) => (
    <FlowStepLibraryItem collapsed onAdd={onAdd} type={sendEmail} />
  ),
  play: async ({ canvasElement }) => {
    await expect(item(canvasElement)).not.toHaveAttribute('aria-describedby')
  },
}

export const DisabledBlocksClickAndDrag: Story = {
  decorators: [PartFrame],
  render: ({ onAdd }) => (
    <FlowStepLibraryItem disabled onAdd={onAdd} type={sendEmail} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = item(canvasElement)
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('draggable', 'false')
    button.click()
    await expect(args.onAdd).not.toHaveBeenCalled()
  },
}

export const RunCardStatusAndProgress: Story = {
  decorators: [PartFrame],
  render: () => (
    <FlowRunCard
      run={{
        completed: 2,
        note: 'Enviar e-mail falhou',
        status: 'failed',
        total: 4,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Última execução',
    })
    await expect(card).toHaveAttribute('data-status', 'failed')
    await expect(within(card).getByText('Falhou')).toBeVisible()
    await expect(within(card).getByText('Enviar e-mail falhou')).toBeVisible()
    await expect(
      within(card).getByRole('progressbar', { name: 'Última execução: 50%' }),
    ).toBeInTheDocument()
  },
}

export const RunCardDescribesCompletedSteps: Story = {
  decorators: [PartFrame],
  render: () => (
    <FlowRunCard run={{ completed: 3, status: 'success', total: 3 }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('3 de 3 passos concluídos')).toBeVisible()
    await expect(
      canvas.getByRole('progressbar', { name: 'Última execução: 100%' }),
    ).toBeInTheDocument()
  },
}

export const RunCardZeroProgressWithoutSteps: Story = {
  decorators: [PartFrame],
  render: () => (
    <FlowRunCard run={{ completed: 0, status: 'not-run', total: 0 }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Não executada')).toBeVisible()
    await expect(
      canvas.getByRole('progressbar', { name: 'Última execução: 0%' }),
    ).toBeInTheDocument()
  },
}
