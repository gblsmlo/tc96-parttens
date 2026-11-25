'use client'

import { useMemo } from 'react'
import { Finance3ClientMoney } from './finance-3-client-money'
import { Finance3Entries } from './finance-3-entries'
import { Finance3Receivables } from './finance-3-receivables'
import { Finance3Statement } from './finance-3-statement'
import { resolveFinance3Labels } from './labels'
import type { Finance3Props } from './types'

export {
  finance3Variants,
  finance3Views,
} from './finance-3-options'

export function Finance3(props: Readonly<Finance3Props>) {
  const labels = useMemo(
    () => resolveFinance3Labels(props.labels),
    [props.labels],
  )
  switch (props.variant) {
    case 'entries':
      return <Finance3Entries {...props} labels={labels} />
    case 'receivables':
      return <Finance3Receivables {...props} labels={labels} />
    case 'statement':
      return <Finance3Statement {...props} labels={labels} />
    case 'clientMoney':
      return <Finance3ClientMoney {...props} labels={labels} />
  }
}
