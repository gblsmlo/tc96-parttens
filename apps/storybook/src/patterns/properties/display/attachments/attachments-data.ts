import type { AttachmentType } from '@tc96/ui/patterns'

export interface AttachmentItem {
  href: string
  id: string
  label: string
  action?: 'anchor' | 'download'
  type?: AttachmentType
}

export const sampleAttachments: readonly AttachmentItem[] = [
  { action: 'download', href: '#file-1', id: 'file-1', label: 'Arquivo 1.pdf' },
  { action: 'download', href: '#file-2', id: 'file-2', label: 'Arquivo 2.pdf' },
]

export const sampleNewAttachment: AttachmentItem = {
  action: 'download',
  href: '#file-3',
  id: 'file-3',
  label: 'Arquivo 3.pdf',
}

export const recordFiles: readonly AttachmentItem[] = [
  {
    action: 'download',
    href: '#proposal',
    id: 'proposal',
    label: 'Proposta comercial.pdf',
    type: 'pdf',
  },
  {
    action: 'download',
    href: '#contract',
    id: 'contract',
    label: 'Contrato assinado.pdf',
    type: 'doc',
  },
]

export const uploadedFile: AttachmentItem = {
  action: 'download',
  href: '#minutes',
  id: 'minutes',
  label: 'Ata do kickoff.pdf',
  type: 'pdf',
}

export const recordLinks: readonly AttachmentItem[] = [
  {
    href: '#playbook',
    id: 'playbook',
    label: 'Playbook de suporte',
    type: 'link',
  },
]

export const pastedLink: AttachmentItem = {
  href: '#status-page',
  id: 'status-page',
  label: 'Página de status',
  type: 'link',
}

export const meetingMaterial: readonly AttachmentItem[] = [
  {
    action: 'download',
    href: '#proposal',
    id: 'proposal',
    label: 'Proposta comercial.pdf',
    type: 'pdf',
  },
  {
    action: 'download',
    href: '#onboarding',
    id: 'onboarding',
    label: 'Playbook de onboarding',
    type: 'doc',
  },
  {
    action: 'download',
    href: '#recording',
    id: 'recording',
    label: 'Gravação da reunião',
    type: 'audio',
  },
  {
    href: '#linkedin',
    id: 'linkedin',
    label: 'Perfil no LinkedIn',
    type: 'link',
  },
]
