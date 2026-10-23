import {
  BellIcon,
  DatabaseIcon,
  FileTextIcon,
  ListPlusIcon,
  MailIcon,
  MessageSquareIcon,
  SparklesIcon,
  UserPlusIcon,
  WrenchIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

export const leadRoutingIcons: Record<string, ReactNode> = {
  crm: <UserPlusIcon />,
  email: <MailIcon />,
  form: <FileTextIcon />,
  list: <ListPlusIcon />,
  slack: <MessageSquareIcon />,
}

export const collectionsIcons: Record<string, ReactNode> = {
  customer: <DatabaseIcon />,
  decide: <SparklesIcon />,
  email: <MailIcon />,
  escalate: <BellIcon />,
  invoice: <FileTextIcon />,
  schedule: <WrenchIcon />,
}
