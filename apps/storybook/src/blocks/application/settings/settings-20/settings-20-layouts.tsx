import {
  Settings20,
  type Settings20Matrix,
  type Settings20Props,
} from '@tc96/blocks/application/settings/settings-20'
import { useState } from 'react'
import {
  settings20Categories,
  settings20Channels,
  settings20Matrix,
} from '../fixtures/settings-20.ts'
import type { Settings20Controls } from './settings-20-controls.ts'

interface ComposedSettings20Props extends Settings20Controls {
  onChange?: Settings20Props['onChange']
}

export const ComposedSettings20 = ({
  description,
  empty,
  onChange,
  readOnly,
  title,
}: Readonly<ComposedSettings20Props>) => {
  const [matrix, setMatrix] = useState<Settings20Matrix>(settings20Matrix)

  return (
    <Settings20
      categories={empty ? [] : settings20Categories}
      channels={settings20Channels}
      labels={{ description, title }}
      matrix={matrix}
      onChange={
        readOnly
          ? undefined
          : (eventId, channelId, checked) => {
              setMatrix((current) => ({
                ...current,
                [eventId]: { ...current[eventId], [channelId]: checked },
              }))
              onChange?.(eventId, channelId, checked)
            }
      }
    />
  )
}
