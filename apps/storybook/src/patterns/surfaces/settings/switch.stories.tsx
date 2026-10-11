import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Switch } from '@tc96/ui/switch'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const onUnderlineLinksChange = fn()

const meta = {
  args: {
    description: 'Always underlines list titles',
    title: 'Underline links',
  },
  component: SettingsRow,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  title: 'Patterns/Surfaces/Settings/Switch',
} satisfies Meta<typeof SettingsRow>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const rgbaOf = (color: string) => {
  const context = document.createElement('canvas').getContext('2d', {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0, a = 255] = context.getImageData(0, 0, 1, 1).data
  return { a: a / 255, b, g, r }
}

const over = (
  top: ReturnType<typeof rgbaOf>,
  bottom: ReturnType<typeof rgbaOf>,
) => ({
  a: 1,
  b: top.b * top.a + bottom.b * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  r: top.r * top.a + bottom.r * (1 - top.a),
})

const luminance = ({ b, g, r }: ReturnType<typeof rgbaOf>) => {
  const channel = (value: number) => {
    const unit = value / 255
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrastOf = (
  first: ReturnType<typeof rgbaOf>,
  second: ReturnType<typeof rgbaOf>,
) => {
  const [light, dark] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  ) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

const backgroundOf = (element: Element) =>
  rgbaOf(getComputedStyle(element).backgroundColor)

export const Default: Story = {
  render: (args) => (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Interface and theme</SettingsSectionTitle>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        {...args}
        endSlot={
          <Switch
            aria-label="Underline links"
            onCheckedChange={onUnderlineLinksChange}
          />
        }
      />
    </SettingsSection>
  ),
}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Underline links' })
    expect(toggle).not.toBeChecked()

    const card = canvasElement.querySelector(
      '[data-slot="card"]',
    ) as HTMLElement
    const surface = backgroundOf(card)
    const track = over(backgroundOf(toggle), surface)
    const thumb = backgroundOf(
      toggle.querySelector('[data-slot="switch-thumb"]') as Element,
    )
    expect(contrastOf(track, surface)).toBeGreaterThanOrEqual(3)
    expect(contrastOf(thumb, track)).toBeGreaterThanOrEqual(3)

    await userEvent.click(toggle)
    await waitFor(() => expect(toggle).toBeChecked())
    expect(onUnderlineLinksChange).toHaveBeenCalledTimes(1)
    expect(onUnderlineLinksChange.mock.calls[0]?.[0]).toBe(true)
  },
  tags: interaction,
}
