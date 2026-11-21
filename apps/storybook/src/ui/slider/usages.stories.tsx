import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Fieldset, FieldsetLegend } from '@tc96/ui/fieldset'
import { Slider, SliderValue } from '@tc96/ui/slider'
import { MinusIcon, PlusIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { SliderCanvas } from './slider-frame.tsx'
import { IconSlider } from './slider-layouts.tsx'

const meta = {
  decorators: [SliderCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Slider/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const firstValue = (value: number | readonly number[]) =>
  typeof value === 'number' ? value : (value[0] ?? 0)

export const Volume: Story = {
  render: () => (
    <IconSlider
      defaultValue={35}
      endIcon={Volume2Icon}
      label="Volume"
      startIcon={VolumeXIcon}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('slider', { name: 'Volume' }),
    ).toHaveAttribute('aria-valuenow', '35')
    await expect(canvas.getByRole('status')).toHaveTextContent('35')
  },
}

const priceMin = 5
const priceMax = 1240

const formatPrice = (price: number) =>
  price === priceMax
    ? `$${price.toLocaleString('en-US')}+`
    : `$${price.toLocaleString('en-US')}`

const PriceRangeFilter = () => {
  const [values, setValues] = useState<readonly number[]>([priceMin, priceMax])

  return (
    <Fieldset className="flex w-full flex-col gap-3">
      <FieldsetLegend className="text-sm tabular-nums">
        From {formatPrice(values[0] ?? priceMin)} to{' '}
        {formatPrice(values[1] ?? priceMax)}
      </FieldsetLegend>
      <Slider
        getAriaLabel={(index) =>
          index === 0 ? 'Minimum price' : 'Maximum price'
        }
        max={priceMax}
        min={priceMin}
        name="price"
        onValueChange={(next) =>
          setValues(typeof next === 'number' ? [next] : next)
        }
        value={values}
      />
    </Fieldset>
  )
}

export const PriceRange: Story = {
  render: () => <PriceRangeFilter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('From $5 to $1,240+')).toBeVisible()
    await expect(
      canvas.getByRole('slider', { name: 'Minimum price' }),
    ).toHaveAttribute('aria-valuenow', '5')
    await expect(
      canvas.getByRole('slider', { name: 'Maximum price' }),
    ).toHaveAttribute('aria-valuenow', '1240')
  },
}

export const StorageSize: Story = {
  render: () => (
    <Field>
      <Slider
        defaultValue={15}
        format={{ style: 'unit', unit: 'gigabyte' }}
        locale="en-US"
        max={35}
        min={5}
        step={5}
      >
        <div className="mb-2 flex items-center justify-between gap-1">
          <FieldLabel>Storage size</FieldLabel>
          <SliderValue />
        </div>
      </Slider>
      <div
        aria-hidden="true"
        className="flex w-full items-center justify-between font-medium text-muted-foreground text-xs"
      >
        <span>5 GB</span>
        <span>20 GB</span>
        <span>35 GB</span>
      </div>
      <FieldDescription>
        Backups count toward this limit. You can resize the volume later.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const thumb = canvas.getByRole('slider', { name: 'Storage size' })
    await expect(thumb).toHaveAttribute('aria-valuetext', '15 GB')
    await expect(thumb).toHaveAccessibleDescription(
      'Backups count toward this limit. You can resize the volume later.',
    )
    await expect(canvas.getByRole('status')).toHaveTextContent('15 GB')
  },
}

const creditsMin = 0
const creditsMax = 200
const creditsStep = 10

const MonthlyCreditsField = () => {
  const [value, setValue] = useState(100)

  return (
    <Field name="credits">
      <FieldLabel className="tabular-nums">
        {value} credits per month
      </FieldLabel>
      <div className="flex w-full items-center gap-2">
        <Button
          aria-label="Remove 10 credits"
          disabled={value === creditsMin}
          onClick={() => setValue(Math.max(creditsMin, value - creditsStep))}
          size="icon-sm"
          variant="outline"
        >
          <MinusIcon aria-hidden="true" />
        </Button>
        <Slider
          className="flex-1"
          getAriaLabel={() => 'Monthly credits'}
          max={creditsMax}
          min={creditsMin}
          onValueChange={(next) => setValue(firstValue(next))}
          step={creditsStep}
          value={value}
        />
        <Button
          aria-label="Add 10 credits"
          disabled={value === creditsMax}
          onClick={() => setValue(Math.min(creditsMax, value + creditsStep))}
          size="icon-sm"
          variant="outline"
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      </div>
    </Field>
  )
}

export const MonthlyCredits: Story = {
  render: () => <MonthlyCreditsField />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('100 credits per month')).toBeVisible()
    await expect(
      canvas.getByRole('slider', { name: 'Monthly credits' }),
    ).toHaveAttribute('aria-valuenow', '100')
    await expect(
      canvas.getByRole('button', { name: 'Add 10 credits' }),
    ).toBeEnabled()
  },
}
