import { afterEach, describe, expect, test } from 'bun:test'
import { LayoutGridIcon } from 'lucide-react'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ViewSettingsMenu } = await import('./collection-view-settings')
const { CollectionToolbar } = await import(
  '../../../shared/components/collection-toolbar'
)

const modesOf = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    icon: LayoutGridIcon,
    label: `Modo ${index + 1}`,
    value: `mode-${index + 1}`,
  }))

const openMenu = async (modeCount: number) => {
  render(
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu
          mode="mode-1"
          modes={modesOf(modeCount)}
          onClearFilters={() => undefined}
        >
          <span>Seção</span>
        </ViewSettingsMenu>
      }
    />,
  )
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: 'Exibição' })),
  )
  return screen.getByRole('menu')
}

afterEach(cleanup)

describe('ViewSettingsMenu width', () => {
  test.each([
    [0, 'w-56'],
    [2, 'w-64'],
    [3, 'w-72'],
    [4, 'w-96'],
  ])('with %i modes the popup is %s', async (modeCount, width) => {
    const menu = await openMenu(modeCount)

    expect(menu.className).toContain(width)
  })
})
