# API de compatibilidade

Base: TC96 0.1.0, inventário antes da migração. Imports preservados: `tc96/ui`, `tc96/utils`, `tc96/components`, `tc96/blocks`. Nova entrada: `tc96/parttens`. `Kanban` continua alias de `KanbanView`. `./registry/view`, `properties`, `detail-sheet`, `editable` permanecem. Filter Builder está excluído por decisão explícita.

Snapshot dos entrypoints:

## src/shared/ui/index.ts

```ts
export { Avatar, AvatarFallback, AvatarImage } from './avatar'
export { Badge, type BadgeProps, badgeVariants } from './badge'
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  buttonSizes,
  buttonVariants,
} from './button'
export { Calendar } from './calendar'
export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldPrimitive,
  FieldValidity,
} from './field'
export { Form, FormPrimitive } from './form'
export { Group, GroupSeparator, GroupText, groupVariants } from './group'
export {
  Input,
  InputPrimitive,
  type InputProps,
  type InputSize,
  inputSizes,
  inputVariants,
} from './input'
export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './input-group'
export { Kbd, KbdGroup } from './kbd'
export {
  Menu,
  MenuCheckboxItem,
  MenuCreateHandle,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from './menu'
export {
  Popover,
  PopoverClose,
  PopoverCreateHandle,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from './popover'
export { Separator, SeparatorPrimitive } from './separator'
export { Spinner } from './spinner'
export { Text, type TextProps, type TextSize, textSizes, textVariants } from './text'
```

## src/features/collection-views/index.ts

```ts
export * from './calendar'
export * from './collection'
export * from './data-grid'
export * from './kanban'
export * from './list'
```

## src/features/properties/index.ts

```ts
export * from './assigned'
export * from './attachments'
export * from './collection'
export * from './date'
export * from './date-range'
export * from './editable-text'
export * from './email'
export * from './flag'
export * from './icon-label'
export * from './people'
export * from './person'
export * from './phone'
export * from './property-catalog'
export * from './property-surface'
export * from './reference'
export * from './select'
export * from './tags'
export * from './text'
```

## src/features/detail-sheet/index.ts

```ts
export * from './components/detail-sheet'
```

## src/features/editable/index.ts

```ts
export * from './components/editable'
```


O comportamento legado de `useDataGrid` contém filtros/ordenação locais opcionais. Preservá-lo; exemplos novos usam as opções manuais da tabela, com estado e eventos do consumidor. Hooks de DOM ficam em módulos cliente e não devem acessar browser durante import/render SSR.
