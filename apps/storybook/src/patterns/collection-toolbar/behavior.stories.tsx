import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem } from '@tc96/ui/menu'
import {
  Action,
  CollectionToolbar,
  CollectionToolbarGroup,
  PresetsMenu,
} from '@tc96/ui/patterns'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { toolbarControlArgs } from './toolbar-controls.ts'
import {
  CenterAndRightSlots,
  ComposedToolbar,
  DefaultSlots,
  LeftCenterRightSlots,
} from './toolbar-layouts.tsx'

const onAction = fn()

const meta = {
  component: CollectionToolbar,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionToolbar/Behavior',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof meta>

const expectMenuClosed = async () => {
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const toolbarOf = (canvasElement: HTMLElement, name = 'Controles da coleção') =>
  within(canvasElement).getByRole('toolbar', { name })

const groupOf = (canvasElement: HTMLElement, name: string) => {
  const group = within(canvasElement)
    .getByRole('button', { name })
    .closest('[data-slot="toolbar-group"]')
  if (!(group instanceof HTMLElement))
    throw new Error(`The ${name} slot did not render.`)
  return group
}

export const SlotsStayOutOfTheDomInOrder: Story = {
  render: () => <LeftCenterRightSlots />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).not.toHaveAttribute('left')
    await expect(toolbar).not.toHaveAttribute('center')
    await expect(toolbar).not.toHaveAttribute('right')
    const [left, center, right] = Array.from(toolbar.children)
    await expect(left).toHaveTextContent(/^left$/)
    await expect(center).toHaveTextContent(/^center$/)
    await expect(right).toHaveTextContent(/^right$/)
  },
}

export const RightGoesToTheEndWithoutCenter: Story = {
  render: () => <DefaultSlots />,
  play: async ({ canvasElement }) => {
    const groups = Array.from(toolbarOf(canvasElement).children)
    await expect(groups).toHaveLength(2)
    await expect(groups[1]).toHaveClass('ms-auto')
  },
}

export const CenterBetweenEqualWidthGroups: Story = {
  render: () => <CenterAndRightSlots />,
  play: async ({ canvasElement }) => {
    const [spacer, center, right] = Array.from(
      toolbarOf(canvasElement).children,
    )
    await expect(spacer).toHaveAttribute('aria-hidden', 'true')
    await expect(spacer?.className).toBe('flex-1 basis-0')
    await expect(center).toHaveTextContent(/^center$/)
    await expect(center).toHaveClass('shrink-0')
    await expect(right).toHaveClass('flex-1', 'basis-0', 'justify-end')
  },
}

export const CenterSitsAtTheMidpoint: Story = {
  render: () => (
    <CollectionToolbar
      center={<button type="button">Período</button>}
      left={
        <button className="w-60" type="button">
          Contexto
        </button>
      }
      right={<button type="button">Ações</button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbarRect = toolbarOf(canvasElement).getBoundingClientRect()
    const centerRect = groupOf(canvasElement, 'Período').getBoundingClientRect()
    await expect(
      Math.abs(
        centerRect.left +
          centerRect.width / 2 -
          (toolbarRect.left + toolbarRect.width / 2),
      ),
    ).toBeLessThan(1)
  },
}

export const PlainIsTheDefaultMode: Story = {
  render: () => <DefaultSlots />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    await expect(toolbar).toHaveClass('border-0', 'bg-transparent', 'p-0')
  },
}

export const DefaultModeKeepsTheFrame: Story = {
  render: () => <DefaultSlots mode="default" />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'default')
    await expect(toolbar).not.toHaveClass('border-0')
    await expect(toolbar).not.toHaveClass('bg-transparent')
  },
}

export const GroupGathersItsControls: Story = {
  render: () => (
    <CollectionToolbar
      left={
        <CollectionToolbarGroup aria-label="Atalhos de prazo">
          <ToolbarButton>Hoje</ToolbarButton>
          <ToolbarButton>Esta semana</ToolbarButton>
        </CollectionToolbarGroup>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Atalhos de prazo' })
    await expect(group).toHaveAttribute('data-slot', 'toolbar-group')
    await expect(within(group).getAllByRole('button')).toHaveLength(2)
    await expect(
      canvas
        .getByRole('button', { name: 'Hoje' })
        .closest('[role="group"][aria-label]'),
    ).toBe(group)
  },
}

export const ArrowKeysMoveFocusBetweenToolbarItems: Story = {
  render: () => (
    <CollectionToolbar
      left={
        <>
          <ToolbarButton>Primeiro</ToolbarButton>
          <ToolbarButton>Segundo</ToolbarButton>
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('button', { name: 'Primeiro' })
    const second = canvas.getByRole('button', { name: 'Segundo' })
    await userEvent.tab()
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(second).toHaveFocus()
    await expect(first).toHaveAttribute('tabindex', '-1')
  },
}

export const PresetsWithLabelCountAndMenu: Story = {
  render: () => (
    <CollectionToolbar
      left={
        <PresetsMenu count={24} countLabel="24 tarefas" label="Minhas tarefas">
          <MenuItem>Todos os filtros</MenuItem>
        </PresetsMenu>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const savedViews = canvas.getByRole('button', { name: /Minhas tarefas/ })
    await expect(canvas.getByText('24')).toBeVisible()
    await expect(canvas.getByLabelText('24 tarefas')).toBeInTheDocument()
    await expect(savedViews).toHaveClass('hover:bg-accent')

    await userEvent.click(savedViews)
    const savedView = await screen.findByRole('menuitem', {
      name: 'Todos os filtros',
    })
    await expect(savedView).toBeVisible()
    await userEvent.click(savedView)
    await expectMenuClosed()
  },
}

export const PrimaryActionHasNoIcon: Story = {
  render: () => (
    <CollectionToolbar
      right={<Action label="Nova tarefa" onClick={onAction} />}
    />
  ),
  play: async ({ canvasElement }) => {
    onAction.mockClear()
    const action = within(canvasElement).getByRole('button', {
      name: 'Nova tarefa',
    })
    await expect(action.querySelector('svg')).toBeNull()
    await userEvent.click(action)
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}

export const HeadingTitleIsAnH2AboveItsDescription: Story = {
  render: () => (
    <ComposedToolbar {...toolbarControlArgs} left="heading" right="none" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('heading', { level: 2, name: 'Tarefas' })
    await expect(title).toHaveAttribute('data-slot', 'collection-toolbar-title')
    const description = canvas.getByText(
      'Acompanhe e organize o trabalho da equipe.',
    )
    await expect(description.tagName).toBe('P')
    await expect(title.nextElementSibling).toBe(description)
  },
}

export const HeadingWithoutDescriptionRendersOnlyTheTitle: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      description=""
      left="heading"
      right="none"
    />
  ),
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector(
      '[data-slot="collection-toolbar-heading"]',
    )
    await expect(heading?.children).toHaveLength(1)
    await expect(
      heading?.querySelector('[data-slot="collection-toolbar-description"]'),
    ).toBeNull()
  },
}
