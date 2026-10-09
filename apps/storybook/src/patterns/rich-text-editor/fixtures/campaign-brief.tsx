import { richTextToPlainText } from '@tc96/helpers/rich-text'
import {
  EditableText,
  EditorTitle,
  type EditorTitleHandle,
  PropertyCollection,
  type PropertyCollectionItem,
  RichTextEditor,
  type RichTextEditorHandle,
  type RichTextValue,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  CalendarCheckIcon,
  CalendarPlusIcon,
  ClipboardCheckIcon,
  CrosshairIcon,
  GoalIcon,
  HandshakeIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  PhoneIcon,
  TargetIcon,
  UserRoundCheckIcon,
} from 'lucide-react'
import { useRef, useState } from 'react'
import {
  clearStored,
  readStored,
  writeStored,
} from '../../../test-utils/usage-kit'

export interface CampaignBrief {
  body: RichTextValue
  description: string | null
  expectedTarget: string | null
  primaryObjective: string | null
  secondaryObjective: string | null
  title: string
}

const objectiveOptions: readonly SelectPropertyOption[] = [
  {
    icon: CalendarPlusIcon,
    label: 'Gerar novas consultas',
    value: 'new-appointments',
  },
  {
    icon: MegaphoneIcon,
    label: 'Divulgar área de atuação',
    value: 'practice-area-awareness',
  },
  {
    icon: UserRoundCheckIcon,
    label: 'Reativar contato antigo',
    value: 'reactivate-contact',
  },
  { icon: HandshakeIcon, label: 'Fortalecer indicação', value: 'referrals' },
]

const targetOptions: readonly SelectPropertyOption[] = [
  {
    icon: CalendarCheckIcon,
    label: 'Consulta agendada',
    value: 'booked-appointment',
  },
  {
    icon: MessageCircleIcon,
    label: 'Conversa no WhatsApp',
    value: 'whatsapp-conversation',
  },
  { icon: PhoneIcon, label: 'Ligação recebida', value: 'phone-call' },
  {
    icon: ClipboardCheckIcon,
    label: 'Formulário enviado',
    value: 'form-submission',
  },
]

function countFilledSections(body: RichTextValue): {
  filled: number
  total: number
} {
  const sections: string[] = []
  for (const node of body) {
    if (node.type === 'h2') {
      sections.push('')
    } else if (sections.length > 0) {
      sections[sections.length - 1] += richTextToPlainText([node])
    }
  }
  return {
    filled: sections.filter((section) => section.trim() !== '').length,
    total: sections.length,
  }
}

export interface CampaignBriefEditorProps {
  initial: CampaignBrief
  storageKey: string
}

export function CampaignBriefEditor({
  initial,
  storageKey,
}: Readonly<CampaignBriefEditorProps>): React.ReactElement {
  const [brief, setBrief] = useState(
    () => readStored<CampaignBrief>(storageKey) ?? initial,
  )
  const [saved, setSaved] = useState(() => readStored(storageKey) !== null)
  const [revision, setRevision] = useState(0)
  const title = useRef<EditorTitleHandle>(null)
  const body = useRef<RichTextEditorHandle>(null)
  const progress = countFilledSections(brief.body)

  const update = (change: Partial<CampaignBrief>) => {
    const next = { ...brief, ...change }
    setBrief(next)
    setSaved(writeStored(storageKey, next))
  }

  const restore = () => {
    clearStored(storageKey)
    setBrief(initial)
    setSaved(false)
    setRevision((current) => current + 1)
  }

  const properties: readonly PropertyCollectionItem[] = [
    {
      defaultVisible: true,
      icon: TargetIcon,
      id: 'primary-objective',
      label: 'Objetivo primário',
      render: () => (
        <SelectProperty
          ariaLabel="Objetivo primário"
          emptyOptionLabel="Sem definição"
          onValueChange={(primaryObjective) => update({ primaryObjective })}
          options={objectiveOptions}
          placeholder="Objetivo primário"
          value={brief.primaryObjective}
        />
      ),
    },
    {
      defaultVisible: true,
      icon: CrosshairIcon,
      id: 'secondary-objective',
      label: 'Objetivo secundário',
      render: () => (
        <SelectProperty
          ariaLabel="Objetivo secundário"
          emptyOptionLabel="Sem definição"
          onValueChange={(secondaryObjective) => update({ secondaryObjective })}
          options={objectiveOptions}
          placeholder="Objetivo secundário"
          value={brief.secondaryObjective}
        />
      ),
    },
    {
      defaultVisible: true,
      icon: GoalIcon,
      id: 'expected-target',
      label: 'Target esperado',
      render: () => (
        <SelectProperty
          ariaLabel="Target esperado"
          emptyOptionLabel="Sem definição"
          onValueChange={(expectedTarget) => update({ expectedTarget })}
          options={targetOptions}
          placeholder="Sem conversão definida"
          value={brief.expectedTarget}
        />
      ),
    },
  ]

  return (
    <article
      className="flex flex-col gap-6"
      data-slot="campaign-brief"
      key={revision}
    >
      <header
        className="flex flex-col gap-3 border-b pb-6"
        data-slot="campaign-brief-header"
      >
        <EditorTitle
          defaultValue={brief.title}
          emptyLabel="Briefing sem título"
          onArrowDownAtEnd={() => body.current?.focusStart()}
          onChange={(value) => update({ title: value })}
          onEnter={() => body.current?.focusStart()}
          ref={title}
        />
        <EditableText
          ariaLabel="Descrição"
          className="text-muted-foreground"
          multiline
          onCommit={(description) => update({ description })}
          placeholder="Adicione uma descrição"
          value={brief.description}
        />
        <PropertyCollection
          ariaLabel="Propriedades do briefing"
          items={properties}
        />
      </header>
      <RichTextEditor
        aria-label="Briefing"
        defaultValue={brief.body}
        onExitStart={() => title.current?.focusEnd()}
        onValueChange={(value) => update({ body: value })}
        placeholder="Escreva, ou digite / para escolher um bloco"
        ref={body}
      />
      <footer
        className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-muted-foreground text-sm"
        data-slot="campaign-brief-footer"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span data-slot="campaign-brief-progress">
            {progress.filled} de {progress.total} seções preenchidas
          </span>
          <output aria-live="polite" data-slot="campaign-brief-status">
            {saved ? 'Salvo neste navegador' : 'Ainda não salvo'}
          </output>
        </div>
        <Button onClick={restore} size="sm" type="button" variant="outline">
          Restaurar modelo
        </Button>
      </footer>
    </article>
  )
}
