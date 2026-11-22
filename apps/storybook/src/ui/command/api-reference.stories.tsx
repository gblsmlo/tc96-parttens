import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from '@tc96/ui/command'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: CommandDialog,
  parameters: {
    docs: { story: { iframeHeight: '520px', inline: false } },
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Command/API Reference',
} satisfies Meta<typeof CommandDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <CommandDialog {...args}>
      <CommandDialogTrigger render={<Button variant="outline" />}>
        <Slot name="CommandDialogTrigger" />
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label="CommandDialogPopup">
        <Command>
          <CommandInput aria-label="CommandInput" placeholder="CommandInput" />
          <CommandPanel>
            <CommandList>
              <CommandGroup>
                <CommandGroupLabel>
                  <Slot name="CommandGroupLabel" />
                </CommandGroupLabel>
                <CommandItem value="first">
                  CommandItem
                  <CommandShortcut>CommandShortcut</CommandShortcut>
                </CommandItem>
                <CommandItem value="second">
                  <Slot name="CommandItem" />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandItem value="third">
                <Slot name="CommandItem" />
              </CommandItem>
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <Slot name="CommandFooter" />
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  ),
}
