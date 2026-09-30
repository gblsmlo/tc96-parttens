export {
  AttachmentProperty,
  type AttachmentPropertyProps,
} from './attachment-property'
// Só o tipo é público: ele nomeia a prop `type` do anexo. O ícone e o catálogo
// ficam internos ao pacote, como nas demais properties de catálogo fechado.
export type { AttachmentType } from './attachment-type'
export {
  AttachmentsProperty,
  type AttachmentsPropertyAction,
  type AttachmentsPropertyProps,
} from './attachments-property'
