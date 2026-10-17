/**
 * Mapas de `control` para props que o docgen não tipa.
 *
 * `react-docgen` (o padrão) documenta os componentes de pacote, mas para parte
 * deles emite a prop só com `defaultValue` e `required`, sem `tsType` — a
 * interface TS nunca é lida. Sem tipo, o Storybook não infere controle e cai no
 * editor de objeto ("Set object") para boolean e em texto livre para união
 * fechada. Trocar para `react-docgen-typescript` piora: o docgen cai de 54
 * arquivos para 5. Declarar o `control` por story é o único contorno que
 * funciona.
 *
 * Só o tipo de controle mora aqui. Descrição de prop é assunto do JSDoc do
 * componente — duplicar em `argTypes` cria segunda fonte.
 */

const boolean = { control: 'boolean' } as const

/** `PropertyVariant`: superfície badge (padrão) ou plain. */
export const propertyVariantArgType = {
  variant: { control: 'inline-radio', options: ['badge', 'plain'] },
} as const

/** Os dois booleanos que as nove Properties compartilham. */
export const propertyStateArgTypes = {
  disabled: boolean,
  readOnly: boolean,
} as const

/** Base das Properties interativas: variante mais os dois estados. */
export const propertyArgTypes = {
  ...propertyVariantArgType,
  ...propertyStateArgTypes,
} as const

export const booleanArgType = boolean

const withoutControl = { control: false } as const

/** `RecordGroup`: variantes, alinhamento das ações e os slots de JSX sem controle. */
export const recordGroupArgTypes = {
  actions: withoutControl,
  actionsAlign: { control: 'inline-radio', options: ['between', 'start'] },
  children: withoutControl,
  defaultOpen: boolean,
  empty: boolean,
  footer: withoutControl,
  open: withoutControl,
  variant: { control: 'inline-radio', options: ['plain', 'card', 'inset'] },
} as const

/** `RecordPreview`: o estado aberto mora na story, os slots são JSX. */
export const recordPreviewArgTypes = {
  actions: withoutControl,
  children: withoutControl,
  footer: withoutControl,
  open: withoutControl,
} as const

/** `RecordDialog`: tamanhos, os booleanos do envio e os slots de JSX. */
export const recordDialogArgTypes = {
  actions: withoutControl,
  children: withoutControl,
  footerStart: withoutControl,
  keepOpenOnSuccess: boolean,
  open: withoutControl,
  size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
  stretchBody: boolean,
  submitDisabled: boolean,
  submitOnModEnter: boolean,
} as const
