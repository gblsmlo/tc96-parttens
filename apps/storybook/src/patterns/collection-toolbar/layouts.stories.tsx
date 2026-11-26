import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarCanvas } from './toolbar-canvas.tsx'
import {
  CenterAndRightSlots,
  DefaultSlots,
  HeadingAndViewMenusSlots,
  LeftCenterRightSlots,
  RightSideSlots,
} from './toolbar-layouts.tsx'

const meta = {
  decorators: [ToolbarCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionToolbar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

export const Default: Story = {
  render: () => <DefaultSlots />,
}

export const LeftCenterRight: Story = {
  parameters: describe(
    '`left` at the start, `center` at the midpoint of the bar and `right` at the end, with both sides sharing the remaining width. For a control that must stay centered whatever the width of the sides.',
  ),
  render: () => <LeftCenterRightSlots />,
}

export const CenterAndRight: Story = {
  parameters: describe(
    '`center` at the midpoint and `right` at the end; a hidden spacer holds the place of `left`. For a bar whose centered control has nothing on its start.',
  ),
  render: () => <CenterAndRightSlots />,
}

export const RightSide: Story = {
  parameters: describe(
    '`right` alone, at the end of the bar. For a bar that only carries the settings or the actions of the view.',
  ),
  render: () => <RightSideSlots />,
}

export const HeadingAndViewMenus: Story = {
  parameters: describe(
    'The heading in `left` and one control per view menu in `right`: the search first, then the filter with its count, the view switcher, the sort and the grouping, and the primary action last. For a collection screen that shows each view menu on its own instead of one view settings.',
  ),
  render: () => <HeadingAndViewMenusSlots />,
}
