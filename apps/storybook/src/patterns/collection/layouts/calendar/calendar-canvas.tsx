import type { Decorator } from '@storybook/react-vite'

export const CalendarCanvas: Decorator = (Story) => (
  <div className="flex h-[44rem] w-[calc(100vw-2rem)] max-w-[1280px] flex-col">
    <Story />
  </div>
)

export const EventChipCanvas: Decorator = (Story) => (
  <div className="w-96 max-w-full p-4">
    <Story />
  </div>
)
