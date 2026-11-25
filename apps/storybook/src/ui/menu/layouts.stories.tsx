import type { Meta, StoryObj } from '@storybook/react-vite'
import { menuControlArgs } from './menu-controls.ts'
import {
  ComposedMenu,
  HeaderOverGroupsBody,
  LabelledGroupsBody,
  RadioGroupInSubmenuBody,
  TwoLineItemsBody,
  TwoLineRadioItemsBody,
} from './menu-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Menu/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

export const Default: Story = {
  render: () => <ComposedMenu {...menuControlArgs} />,
}

export const LabelledGroups: Story = {
  parameters: describe(
    'Each set of actions sits in a `MenuGroup` under its `MenuGroupLabel`, with a `MenuSeparator` between sets and the destructive item last. For menus with more than one kind of action.',
  ),
  render: () => (
    <ComposedMenu {...menuControlArgs}>
      <LabelledGroupsBody />
    </ComposedMenu>
  ),
}

export const HeaderOverGroups: Story = {
  parameters: describe(
    'The first `MenuGroupLabel` holds a header with an icon or avatar, a name and a muted line, over the actions on what it names; the destructive item stays last. For menus about one record or one person.',
  ),
  render: () => (
    <ComposedMenu {...menuControlArgs} align="start">
      <HeaderOverGroupsBody />
    </ComposedMenu>
  ),
}

export const TwoLineItems: Story = {
  parameters: describe(
    'Each item holds a leading icon and a name over a muted line, under a group label, with a centered item after a separator that opens the full list. For short feeds of recent entries.',
  ),
  render: () => (
    <ComposedMenu {...menuControlArgs} align="start">
      <TwoLineItemsBody />
    </ComposedMenu>
  ),
}

export const TwoLineRadioItems: Story = {
  parameters: describe(
    'A labelled `MenuRadioGroup` whose items hold a leading icon and a name over a muted line, with the check of the chosen one at the end. For picking one option that needs a word of explanation.',
  ),
  render: () => (
    <ComposedMenu {...menuControlArgs} align="start">
      <TwoLineRadioItemsBody />
    </ComposedMenu>
  ),
}

export const RadioGroupInSubmenu: Story = {
  parameters: describe(
    'A `MenuSubTrigger` shows the current value at its end and opens a `MenuSubPopup` with a `MenuRadioGroup` of the values, between plain actions. For a setting that sits among actions without taking their room.',
  ),
  render: () => (
    <ComposedMenu {...menuControlArgs} align="start">
      <RadioGroupInSubmenuBody />
    </ComposedMenu>
  ),
}

export const IconTrigger: Story = {
  parameters: describe(
    'An icon button opens the menu, named by its `aria-label`, with the popup aligned to its end. For actions on a row, a card or a toolbar, where a text button takes too much room.',
  ),
  render: () => <ComposedMenu {...menuControlArgs} align="end" iconTrigger />,
}
