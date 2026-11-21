import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@tc96/ui/label'
import { expect, userEvent, within } from 'storybook/test'
import { labelControlArgs } from './label-controls.ts'
import { LabelCanvas } from './label-frame.tsx'
import {
  CheckboxInLabel,
  ComposedLabel,
  GroupCaptionLabel,
  LabelBesideSwitch,
} from './label-layouts.tsx'

const mobile = { viewport: { isRotated: false, value: 'mobile2' } }
const desktop = { viewport: { isRotated: false, value: 'desktop' } }

const labelOf = (canvasElement: HTMLElement) => {
  const label = canvasElement.querySelector('[data-slot="label"]')
  if (!(label instanceof HTMLElement))
    throw new Error('No element carries data-slot="label".')
  return label
}

const meta = {
  decorators: [LabelCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Label/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NamesControlByHtmlFor: Story = {
  render: () => <ComposedLabel {...labelControlArgs} />,
  play: async ({ canvasElement }) => {
    const label = labelOf(canvasElement)
    const input = within(canvasElement).getByRole('textbox')
    await expect(label.tagName).toBe('LABEL')
    await expect(label).toHaveAttribute('for', input.id)
    await expect(input).toHaveAccessibleName('Email')
  },
}

export const ClickFocusesControl: Story = {
  render: () => <ComposedLabel {...labelControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email' })
    await expect(input).not.toHaveFocus()
    await userEvent.click(canvas.getByText('Email'))
    await expect(input).toHaveFocus()
  },
}

export const WrappingNamesControl: Story = {
  render: () => <CheckboxInLabel />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('checkbox'),
    ).toHaveAccessibleName('Label text')
  },
}

export const WrappingClickToggles: Story = {
  render: () => <CheckboxInLabel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(canvas.getByText('Label text'))
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const HtmlForTogglesSwitch: Story = {
  render: () => <LabelBesideSwitch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('switch', { name: 'Label text' })
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(canvas.getByText('Label text'))
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const MarkerStaysOutOfName: Story = {
  render: () => <ComposedLabel {...labelControlArgs} required />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('*')).toBeVisible()
    await expect(canvas.getByRole('textbox')).toHaveAccessibleName('Email')
  },
}

export const RenderKeepsSlotAndClasses: Story = {
  render: () => <ComposedLabel {...labelControlArgs} element="span" />,
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText('Email')
    await expect(label.tagName).toBe('SPAN')
    await expect(label).toHaveAttribute('data-slot', 'label')
    await expect(label).toHaveClass('inline-flex', 'font-medium')
  },
}

export const CaptionNamesGroup: Story = {
  render: () => <GroupCaptionLabel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('radiogroup')).toHaveAccessibleName(
      'Group caption',
    )
  },
}

export const ClassNameWins: Story = {
  render: () => (
    <Label className="text-muted-foreground">Optional details</Label>
  ),
  play: async ({ canvasElement }) => {
    const label = labelOf(canvasElement)
    await expect(label).toHaveClass('text-muted-foreground')
    await expect(label).not.toHaveClass('text-foreground')
  },
}

export const LargerTextOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedLabel {...labelControlArgs} />,
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(labelOf(canvasElement))
    await expect(style.fontSize).toBe('16px')
    await expect(style.lineHeight).toBe('18px')
  },
}

export const SmallerTextFromSm: Story = {
  globals: desktop,
  render: () => <ComposedLabel {...labelControlArgs} />,
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(labelOf(canvasElement))
    await expect(style.fontSize).toBe('14px')
    await expect(style.lineHeight).toBe('16px')
  },
}
