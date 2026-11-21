import { Button } from '@tc96/ui/button'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerItem,
  type ComposerItemValue,
  ComposerList,
  ComposerPopup,
  type ComposerQuery,
  ComposerStatus,
  ComposerSubmit,
  ComposerToken,
  type ComposerTokenPart,
  type ComposerTrigger,
  type ComposerValue,
  useComposerContext,
} from '@tc96/ui/composer'
import {
  ArrowUpIcon,
  AtSignIcon,
  PaperclipIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react'
import type { ComposerControls } from './composer-controls.ts'
import { sampleTriggers, textDraft } from './composer-data.ts'
import type { ComposerSubmitOnEnterName } from './composer-variants.ts'

interface ComposerCallbacks {
  onAction?: (item: ComposerItemValue, query: ComposerQuery) => void
  onSubmit?: (value: ComposerValue) => void
  triggers?: readonly ComposerTrigger[]
}

export const SendButton = () => (
  <ComposerSubmit
    render={
      <Button aria-label="Send message" size="icon">
        <ArrowUpIcon aria-hidden="true" />
      </Button>
    }
  />
)

export const AttachButton = () => (
  <Button aria-label="Attach file" size="icon-sm" variant="ghost">
    <PaperclipIcon aria-hidden="true" />
  </Button>
)

export const MentionButton = () => {
  const { insertTrigger } = useComposerContext()
  return (
    <Button
      aria-label="Mention someone"
      onClick={() => insertTrigger('@')}
      size="icon-sm"
      variant="ghost"
    >
      <AtSignIcon aria-hidden="true" />
    </Button>
  )
}

export const ResetButton = () => {
  const { isEmpty, reset } = useComposerContext()
  return (
    <Button disabled={isEmpty} onClick={reset} size="sm" variant="ghost">
      Reset
    </Button>
  )
}

const SuggestionStatus = () => {
  const { status } = useComposerContext()
  if (status !== 'loading') return null
  return <ComposerStatus>Searching people…</ComposerStatus>
}

export const SuggestionsPopup = () => (
  <ComposerPopup>
    <SuggestionStatus />
    <ComposerList>
      {(item) => (
        <ComposerItem key={item.id} value={item}>
          {item.label}
        </ComposerItem>
      )}
    </ComposerList>
  </ComposerPopup>
)

export const renderChipToken = (token: ComposerTokenPart) => (
  <ComposerToken
    icon={
      token.kind === 'team' ? (
        <UsersRoundIcon aria-hidden="true" />
      ) : (
        <UserRoundIcon aria-hidden="true" />
      )
    }
    token={token}
    variant="chip"
  />
)

interface ComposerBehavior {
  allowEmpty?: boolean
  submitOnEnter?: ComposerSubmitOnEnterName
}

export const ComposedComposer = ({
  allowEmpty,
  defaultText,
  disabled,
  input,
  layout,
  leading,
  onAction,
  onSubmit,
  placeholder,
  readOnly,
  submitDisabled,
  submitOnEnter,
  suggestions,
  tokenVariant,
  triggers = sampleTriggers,
}: Readonly<ComposerControls & ComposerCallbacks & ComposerBehavior>) => (
  <Composer
    allowEmpty={allowEmpty}
    defaultValue={defaultText ? textDraft(defaultText) : undefined}
    disabled={disabled}
    key={`${input}:${defaultText}`}
    layout={layout}
    onAction={onAction}
    onSubmit={onSubmit}
    readOnly={readOnly}
    submitDisabled={submitDisabled}
    submitOnEnter={submitOnEnter}
    triggers={suggestions ? triggers : undefined}
  >
    {input === 'textarea' ? (
      <ComposerInput
        render={<textarea aria-label="Message" placeholder={placeholder} />}
      />
    ) : (
      <ComposerInput
        aria-label="Message"
        placeholder={placeholder}
        renderToken={tokenVariant === 'chip' ? renderChipToken : undefined}
      />
    )}
    {suggestions ? <SuggestionsPopup /> : null}
    <ComposerActions>
      {leading || suggestions ? (
        <ComposerActionGroup>
          {leading ? <AttachButton /> : null}
          {suggestions ? <MentionButton /> : null}
        </ComposerActionGroup>
      ) : null}
      <ComposerActionGroup align="end">
        <SendButton />
      </ComposerActionGroup>
    </ComposerActions>
  </Composer>
)

export const CustomControlComposer = () => (
  <Composer>
    <ComposerInput aria-label="Message" placeholder="Write a message…" />
    <ComposerActions>
      <ComposerActionGroup>
        <ResetButton />
      </ComposerActionGroup>
      <ComposerActionGroup align="end">
        <SendButton />
      </ComposerActionGroup>
    </ComposerActions>
  </Composer>
)
