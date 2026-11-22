import type { AttachmentType } from '@tc96/parttens'

export interface AttachmentItem {
  href: string
  id: string
  label: string
  action?: 'anchor' | 'download'
  type?: AttachmentType
}

export const sampleAttachments: readonly AttachmentItem[] = [
  { action: 'download', href: '#file-1', id: 'file-1', label: 'File 1.pdf' },
  { action: 'download', href: '#file-2', id: 'file-2', label: 'File 2.pdf' },
]

export const sampleNewAttachment: AttachmentItem = {
  action: 'download',
  href: '#file-3',
  id: 'file-3',
  label: 'File 3.pdf',
}

export const recordFiles: readonly AttachmentItem[] = [
  {
    action: 'download',
    href: '#proposal',
    id: 'proposal',
    label: 'Commercial proposal.pdf',
    type: 'pdf',
  },
  {
    action: 'download',
    href: '#contract',
    id: 'contract',
    label: 'Signed contract.pdf',
    type: 'doc',
  },
]

export const uploadedFile: AttachmentItem = {
  action: 'download',
  href: '#minutes',
  id: 'minutes',
  label: 'Kickoff minutes.pdf',
  type: 'pdf',
}

export const recordLinks: readonly AttachmentItem[] = [
  {
    href: '#playbook',
    id: 'playbook',
    label: 'Support playbook',
    type: 'link',
  },
]

export const pastedLink: AttachmentItem = {
  href: '#status-page',
  id: 'status-page',
  label: 'Status page',
  type: 'link',
}

export const meetingMaterial: readonly AttachmentItem[] = [
  {
    action: 'download',
    href: '#proposal',
    id: 'proposal',
    label: 'Commercial proposal.pdf',
    type: 'pdf',
  },
  {
    action: 'download',
    href: '#onboarding',
    id: 'onboarding',
    label: 'Onboarding playbook',
    type: 'doc',
  },
  {
    action: 'download',
    href: '#recording',
    id: 'recording',
    label: 'Meeting recording',
    type: 'audio',
  },
  {
    href: '#linkedin',
    id: 'linkedin',
    label: 'LinkedIn profile',
    type: 'link',
  },
]
