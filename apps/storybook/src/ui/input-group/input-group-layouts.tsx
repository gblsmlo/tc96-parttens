import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@tc96/ui/input-group'
import type { InputGroupControls } from './input-group-controls.ts'

interface ComposedInputGroupProps extends InputGroupControls {
  onSearch?: () => void
}

export const ComposedInputGroup = ({
  align,
  button,
  disabled,
  endText,
  icon,
  invalid,
  onSearch,
  placeholder,
  size,
  text,
  textarea,
}: Readonly<ComposedInputGroupProps>) => {
  const label = placeholder || 'Search'
  const ariaInvalid = invalid ? true : undefined
  return (
    <InputGroup>
      {textarea ? (
        <InputGroupTextarea
          aria-invalid={ariaInvalid}
          aria-label={label}
          disabled={disabled}
          placeholder={placeholder}
          size={size}
        />
      ) : (
        <InputGroupInput
          aria-invalid={ariaInvalid}
          aria-label={label}
          disabled={disabled}
          placeholder={placeholder}
          size={size}
          type="search"
        />
      )}
      {icon || text ? (
        <InputGroupAddon align={align}>
          {icon ? <MagnifyingGlassIcon aria-hidden="true" /> : null}
          {text ? <InputGroupText>{text}</InputGroupText> : null}
        </InputGroupAddon>
      ) : null}
      {endText || button ? (
        <InputGroupAddon align={textarea ? 'block-end' : 'inline-end'}>
          {endText ? <InputGroupText>{endText}</InputGroupText> : null}
          {button ? (
            <Button
              className={textarea ? 'ml-auto' : undefined}
              disabled={disabled}
              onClick={onSearch}
              size="xs"
              variant="secondary"
            >
              Search
            </Button>
          ) : null}
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
