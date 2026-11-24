import {
  BellIcon,
  ChatIcon,
  DatabaseIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  ListPlusIcon,
  SparkleIcon,
  UserPlusIcon,
  WrenchIcon,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'

export const leadRoutingIcons: Record<string, ReactNode> = {
  crm: <UserPlusIcon aria-hidden="true" />,
  email: <EnvelopeSimpleIcon aria-hidden="true" />,
  form: <FileTextIcon aria-hidden="true" />,
  list: <ListPlusIcon aria-hidden="true" />,
  slack: <ChatIcon aria-hidden="true" />,
}

export const collectionsIcons: Record<string, ReactNode> = {
  customer: <DatabaseIcon aria-hidden="true" />,
  decide: <SparkleIcon aria-hidden="true" />,
  email: <EnvelopeSimpleIcon aria-hidden="true" />,
  escalate: <BellIcon aria-hidden="true" />,
  invoice: <FileTextIcon aria-hidden="true" />,
  schedule: <WrenchIcon aria-hidden="true" />,
}
