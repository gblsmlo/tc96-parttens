import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  CollectionFrameOverlay,
  CollectionLayoutOutlet,
  CollectionProvider,
  CollectionSearchField,
  CollectionToolbar,
  FilterRadioSubmenu,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { CircleDotIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

interface Item {
  id: string
  title: string
}

const collection = {
  getKey: (record: Item) => record.id,
  getLabel: (record: Item) => record.title,
  groupings: [],
  records: [
    { id: 'first', title: 'Primeiro item' },
    { id: 'second', title: 'Segundo item' },
  ],
}

const ignore = () => undefined

const meta = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex h-[32rem] flex-col p-6">
      <CollectionProvider
        collection={collection}
        defaultPreferences={{ groupBy: null, layout: 'list' }}
      >
        <CollectionFrame>
          <CollectionFrameHeader>
            <CollectionToolbar
              endSlot={
                <>
                  <ViewSettingsMenu onClearFilters={ignore}>
                    <ViewSettingsSection label="ViewSettingsSection">
                      <FilterRadioSubmenu
                        icon={CircleDotIcon}
                        label="FilterRadioSubmenu"
                        onValueChange={ignore}
                        options={[]}
                      />
                    </ViewSettingsSection>
                  </ViewSettingsMenu>
                  <Action label="Action" onClick={ignore} />
                </>
              }
              startSlot={
                <CollectionSearchField
                  label="CollectionSearchField"
                  onCommit={ignore}
                  placeholder="CollectionSearchField"
                />
              }
            />
          </CollectionFrameHeader>
          <CollectionFrameBody aria-label="CollectionFrameBody">
            <CollectionLayoutOutlet
              collection={collection}
              renderListRecord={() => <Slot name="renderListRecord" />}
            />
          </CollectionFrameBody>
          <CollectionFrameFooter>
            <Slot name="CollectionFrameFooter" />
            <CollectionFrameOverlay>
              <Slot name="CollectionFrameOverlay" />
            </CollectionFrameOverlay>
          </CollectionFrameFooter>
        </CollectionFrame>
      </CollectionProvider>
    </div>
  ),
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Collection/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const frameSlots = [
  'collection-frame',
  'collection-frame-header',
  'collection-frame-body',
  'collection-frame-footer',
  'collection-frame-overlay',
  'list-view',
]

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const slot of frameSlots) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
    await expect(
      canvas.getByRole('searchbox', { name: 'CollectionSearchField' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Exibição' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Action' })).toBeVisible()
    await expect(canvas.getAllByText('renderListRecord')).toHaveLength(2)
  },
}
