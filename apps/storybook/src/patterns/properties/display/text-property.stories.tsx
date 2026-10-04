import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/parttens'
import { MailIcon, PhoneIcon, ShapesIcon } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../test-utils/property-surface'
import { propertyVariantArgType } from '../../../test-utils/story-arg-types'

const meta = {
  argTypes: propertyVariantArgType,
  component: TextProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Generic text property unit for simple values such as type, source, category, area, or origin. It is read-only and keeps domain labels in the consumer.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Text',
} satisfies Meta<typeof TextProperty>

export default meta

type Story = StoryObj<typeof TextProperty>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
  args: {
    ariaLabel: 'Type',
    icon: ShapesIcon,
    value: 'Document request',
  },
}

export const Plain: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
  },
  args: {
    ariaLabel: 'Type',
    icon: ShapesIcon,
    value: 'Document request',
    variant: 'plain',
  },
}

export const WithCopy: Story = {
  args: {
    ariaLabel: 'Email',
    copyLabel: 'Copy contact email',
    icon: MailIcon,
    value: 'mariana@example.com',
  },
  parameters: {
    docs: {
      description: {
        story:
          "`copyLabel` turns on the copy affordance to the right of the value, in the same anatomy as the `×` of `AttachmentProperty`: an icon inside the pill itself, not a control beside it. Writing to the clipboard is the property's job; the consumer only names what is being copied.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const surface = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-surface"]',
    )

    await expect(
      canvas.getByRole('button', { name: 'Copy contact email' }),
    ).toBeVisible()
    // Children of `img` are presentational, so an `img` surface would hide the button from the a11y tree; `getByRole` alone misses that.
    await expect(surface?.getAttribute('role')).not.toBe('img')
    await expect(surface?.getAttribute('role')).toBe('group')
  },
}

export const WithCopyOnHover: Story = {
  args: {
    ariaLabel: 'Email',
    copyLabel: 'Copy contact email',
    trailingVisibility: 'hover',
    icon: MailIcon,
    value: 'mariana@example.com',
  },
  parameters: {
    docs: {
      description: {
        story:
          "`trailingVisibility='hover'` hides the affordance until the pointer arrives, and its space stays reserved, so the row does not jump. It suits the sidebar where every row offers the same action and a column of repeated icons competes with the values for attention. Keyboard and touch still reach it: `focus-within` and `pointer-coarse` reveal it without hover.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const copyButton = canvas.getByRole('button', {
      name: 'Copy contact email',
    })
    const affordance = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-trailing"]',
    )

    await expect(affordance).not.toBeNull()
    if (!affordance) return

    // At rest the affordance is invisible but still takes up its space, so the row does not jump when it appears.
    await expect(getComputedStyle(affordance).opacity).toBe('0')
    await expect(affordance.getBoundingClientRect().width).toBeGreaterThan(0)

    // `userEvent.hover` dispatches a synthetic event and CSS `:hover` only responds to a real pointer, so only the keyboard path is covered here.
    copyButton.focus()
    await waitFor(() => expect(getComputedStyle(affordance).opacity).toBe('1'))
  },
}

export const Empty: Story = {
  args: {
    ariaLabel: 'Category',
    copyLabel: 'Copy category',
    fallback: 'No category',
    icon: ShapesIcon,
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With no value the copy affordance does not show even when requested: copying the absence text would put "No category" on the clipboard.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-surface"]',
    )

    await expect(
      canvasElement.querySelector('[data-slot="text-property-copy"]'),
    ).toBeNull()
    // Absence recedes to the placeholder tone, otherwise the fallback reads with the same weight as a filled value.
    await expect(surface?.dataset.empty).toBe('true')
  },
}

export const EmptyWithTrigger: Story = {
  args: {
    ariaLabel: 'Phone',
    fallback: 'No phone',
    icon: PhoneIcon,
    inputPlaceholder: '+55 81 3333-0000',
    onCommit: fn(),
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty and editable, the property offers to be filled instead of just declaring absence, in the same anatomy as the `+` of `TagsProperty` and the trigger of `EmailProperty`. Clicking swaps the trigger for the field, in place.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'No phone' }))
    const field = await canvas.findByRole<HTMLInputElement>('textbox', {
      name: 'Phone',
    })

    await expect(field).toBeVisible()
    // The trigger said there is no value; the field shows how the value is written.
    await expect(field.placeholder).toBe('+55 81 3333-0000')
  },
}

export const EditableInline: Story = {
  args: {
    ariaLabel: 'Email',
    editing: 'inline',
    fallback: 'No email',
    icon: MailIcon,
    onCommit: fn(),
    value: 'mariana@example.com',
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field takes the value's place from the start: clicking is already writing, with no intermediate trigger. It suits a unit that is the showcase of a record, where the row exists to be filled. Commit happens on `blur`, per the `EditableText` contract.",
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Email' })

    await userEvent.clear(field)
    await userEvent.type(field, 'new@example.com')
    await userEvent.tab()

    await waitFor(() =>
      expect(args.onCommit).toHaveBeenCalledWith('new@example.com'),
    )
  },
}
