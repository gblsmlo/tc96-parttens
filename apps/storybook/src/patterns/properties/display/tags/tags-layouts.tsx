import { TagsProperty, type TagsPropertyProps } from '@tc96/parttens'
import { useState } from 'react'
import type { TagsControls } from './tags-controls.ts'
import { tagOptions } from './tags-data.ts'

type StatefulTagsProps = Omit<TagsPropertyProps, 'onValueChange' | 'value'> & {
  initialValue: readonly string[]
}

export const StatefulTags = ({
  initialValue,
  ...props
}: Readonly<StatefulTagsProps>) => {
  const [value, setValue] = useState(initialValue)

  return <TagsProperty {...props} onValueChange={setValue} value={value} />
}

export const ComposedTags = ({ value, ...props }: Readonly<TagsControls>) => (
  <StatefulTags
    {...props}
    initialValue={value}
    key={value.join()}
    options={tagOptions}
  />
)
