import type { Decorator } from '@storybook/react-vite'

export const ItemCanvas: Decorator = (Story) => (
  <ul className="w-96 [--avatar-size:--spacing(10)]">
    <Story />
  </ul>
)

export const SkeletonCanvas: Decorator = (Story) => (
  <div className="w-96 [--avatar-size:--spacing(10)]">
    <Story />
  </div>
)
