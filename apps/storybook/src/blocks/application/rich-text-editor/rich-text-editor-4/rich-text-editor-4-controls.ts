import type { ArgTypes } from '@storybook/react-vite'

export interface RichTextEditor4Controls {
  autoplay: boolean
  replay: boolean
  teammates: number
}

export const richTextEditor4ControlArgs: RichTextEditor4Controls = {
  autoplay: true,
  replay: true,
  teammates: 3,
}

export const richTextEditor4ControlArgTypes: Partial<
  ArgTypes<RichTextEditor4Controls>
> = {
  autoplay: {
    control: 'boolean',
    description:
      'The `autoplay` option of `createLocalRoom`; off, the scripted teammates only move when `room.step()` is called.',
  },
  replay: {
    control: 'boolean',
    description:
      'Passes `room.replay`; without it the Reproduzir button is absent.',
  },
  teammates: {
    control: { max: 3, min: 0, type: 'number' },
    description: 'How many scripted teammates of the fixture join the room.',
  },
}
