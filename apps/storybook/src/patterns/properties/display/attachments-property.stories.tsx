import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentProperty, AttachmentsProperty } from '@tc96/parttens'
import { LinkIcon, PaperclipIcon } from 'lucide-react'
import { expect } from 'storybook/test'

const meta = {
  args: {
    ariaLabel: 'Record files',
  },
  component: AttachmentsProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-72 w-full max-w-xl items-start p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The attachments row, with the add path always in view. Attaching is what you do on an empty row, and hiding it behind `…` would leave the initial state with no affordance, so the action is its own chip rather than a menu entry as in `Properties/Collection`, where the `…` holds visibility. There is **one** trigger, like the `+` in `Properties/Tags`: rows that accept different things are different rows, each with its own label. Each item is an `AttachmentProperty`: a tonal icon by `type`, a truncated label and the remove `×`, in the same anatomy as the Tags chip.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Attachments',
} satisfies Meta<typeof AttachmentsProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    action: {
      icon: PaperclipIcon,
      label: 'Attach file',
      onSelect: () => undefined,
    },
    children: (
      <>
        <AttachmentProperty
          action="download"
          href="#proposal"
          label="Commercial proposal.pdf"
          onRemove={() => undefined}
          removeLabel="Remove Commercial proposal.pdf"
          type="pdf"
        />
        <AttachmentProperty
          action="download"
          href="#contract"
          label="Signed contract.pdf"
          onRemove={() => undefined}
          removeLabel="Remove Signed contract.pdf"
          type="doc"
        />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="attachments-property"]'),
    ).not.toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="attachment-property"]'),
    ).toHaveLength(2)
    // One trigger only, collapsed to `+`: two identical `+` would not say which is which.
    await expect(
      canvasElement.querySelectorAll('button[aria-label="Attach file"]'),
    ).toHaveLength(1)
  },
}

export const Links: Story = {
  args: {
    action: {
      icon: LinkIcon,
      label: 'Add link',
      onSelect: () => undefined,
    },
    ariaLabel: 'Record links',
    children: (
      <AttachmentProperty
        href="#playbook"
        label="Support playbook"
        onRemove={() => undefined}
        removeLabel="Remove Support playbook"
        type="link"
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Files and links do not share a row: each has its own label and its single add path, which is how the Documents feature composes the two.',
      },
    },
  },
}

export const ReadOnly: Story = {
  args: {
    children: (
      <AttachmentProperty
        href="#playbook"
        label="Support playbook"
        type="link"
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without `action` the trigger disappears, and without `onRemove` the chip loses its `×`. This is the state for listing attachments without being able to change them.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('button')).toBeNull()
  },
}

export const Empty: Story = {
  args: {
    action: {
      icon: PaperclipIcon,
      label: 'Attach file',
      onSelect: () => undefined,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'With no attachments yet, the trigger shows its full label, since a lone `+` would not say what it adds.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('button')?.textContent).toContain(
      'Attach file',
    )
  },
}

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One chip per catalog type. All end in the same `×`: `anchor` and `download` only decide how the target opens, not the affordance on the right.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const types = [
      ...canvasElement.querySelectorAll('[data-slot="attachment-type-icon"]'),
    ].map((icon) => icon.getAttribute('data-attachment-type'))

    await expect(types).toEqual(['pdf', 'doc', 'audio', 'link'])
    await expect(canvasElement.querySelectorAll('a[download]')).toHaveLength(3)
    await expect(
      canvasElement.querySelectorAll(
        '[data-slot="attachment-property-remove"]',
      ),
    ).toHaveLength(4)
  },
  render: (args) => (
    <AttachmentsProperty {...args}>
      <AttachmentProperty
        action="download"
        href="#proposal"
        label="Commercial proposal.pdf"
        onRemove={() => undefined}
        removeLabel="Remove Commercial proposal.pdf"
        type="pdf"
      />
      <AttachmentProperty
        action="download"
        href="#playbook"
        label="Onboarding playbook"
        onRemove={() => undefined}
        removeLabel="Remove Onboarding playbook"
        type="doc"
      />
      <AttachmentProperty
        action="download"
        href="#recording"
        label="Meeting recording"
        onRemove={() => undefined}
        removeLabel="Remove Meeting recording"
        type="audio"
      />
      <AttachmentProperty
        href="#linkedin"
        label="LinkedIn profile"
        onRemove={() => undefined}
        removeLabel="Remove LinkedIn profile"
        type="link"
      />
    </AttachmentsProperty>
  ),
}
