import { TagsProperty, type TagsPropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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

  return (
    <TagsProperty
      placeholder="Adicionar uma tag"
      {...props}
      onValueChange={setValue}
      value={value}
      labels={{ ...ptBRPropertyLabels.tags, ...props.labels }}
    />
  )
}

export const ComposedTags = ({
  labelsAdd,
  labelsEmpty,
  labelsLoading,
  labelsRemove,
  value,
  ...props
}: Readonly<TagsControls>) => (
  <StatefulTags
    {...props}
    initialValue={value}
    key={value.join()}
    labels={{
      add: labelsAdd,
      empty: labelsEmpty,
      loading: labelsLoading,
      remove: labelsRemove,
    }}
    options={tagOptions}
  />
)
