import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerMenuTrigger,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@tc96/ui/drawer'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Drawer,
  parameters: {
    docs: { story: { iframeHeight: '480px', inline: false } },
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Drawer/API Reference',
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>
        <Slot name="DrawerTrigger" />
      </DrawerTrigger>
      <DrawerPopup showBar>
        <DrawerHeader>
          <DrawerTitle>
            <Slot name="DrawerTitle" />
          </DrawerTitle>
          <DrawerDescription>
            <Slot name="DrawerDescription" />
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>
          <Slot name="DrawerPanel" />
        </DrawerPanel>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost" />}>
            <Slot name="DrawerClose" />
          </DrawerClose>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  ),
}

export const MenuAnatomy: Story = {
  args: { defaultOpen: true },
  parameters: {
    docs: { story: { iframeHeight: '560px', inline: false } },
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>
        <Slot name="DrawerTrigger" />
      </DrawerTrigger>
      <DrawerPopup aria-label="Menu anatomy" showBar>
        <DrawerPanel>
          <DrawerMenu>
            <DrawerMenuGroup>
              <DrawerMenuGroupLabel>
                <Slot name="DrawerMenuGroupLabel" />
              </DrawerMenuGroupLabel>
              <DrawerMenuItem>
                <Slot name="DrawerMenuItem" />
              </DrawerMenuItem>
            </DrawerMenuGroup>
            <DrawerMenuSeparator />
            <DrawerMenuCheckboxItem defaultChecked>
              <Slot name="DrawerMenuCheckboxItem" />
            </DrawerMenuCheckboxItem>
            <DrawerMenuSeparator />
            <DrawerMenuRadioGroup defaultValue="first">
              <DrawerMenuRadioItem value="first">
                <Slot name="DrawerMenuRadioItem" />
              </DrawerMenuRadioItem>
            </DrawerMenuRadioGroup>
            <DrawerMenuSeparator />
            <Drawer>
              <DrawerMenuTrigger>
                <Slot name="DrawerMenuTrigger" />
              </DrawerMenuTrigger>
              <DrawerPopup aria-label="Nested menu" showBar>
                <DrawerPanel>
                  <DrawerMenu>
                    <DrawerMenuItem>
                      <Slot name="DrawerMenuItem" />
                    </DrawerMenuItem>
                  </DrawerMenu>
                </DrawerPanel>
              </DrawerPopup>
            </Drawer>
          </DrawerMenu>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  ),
}
