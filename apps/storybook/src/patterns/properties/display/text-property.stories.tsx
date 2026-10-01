import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/parttens'
import { MailIcon, PhoneIcon, ShapesIcon } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../test-utils/property-surface'
import { propertyVariantArgType } from '../../../test-utils/story-arg-types'

const meta = {
  argTypes: propertyVariantArgType,
  component: TextProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Generic text property unit for simple values such as type, source, category, area, or origin. It is read-only and keeps domain labels in the consumer.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Properties/Display/Text',
} satisfies Meta<typeof TextProperty>

export default meta

type Story = StoryObj<typeof TextProperty>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
  args: {
    ariaLabel: 'Type',
    icon: ShapesIcon,
    value: 'Document request',
  },
}

export const Plain: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
  },
  args: {
    ariaLabel: 'Type',
    icon: ShapesIcon,
    value: 'Document request',
    variant: 'plain',
  },
}

export const WithCopy: Story = {
  args: {
    ariaLabel: 'E-mail',
    copyLabel: 'Copiar e-mail do contato',
    icon: MailIcon,
    value: 'mariana@exemplo.com.br',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`copyLabel` acende a afordância de cópia à direita do valor, na mesma anatomia do `×` de `AttachmentProperty`: um ícone dentro da própria pílula, não um controle ao lado dela. A escrita na área de transferência é da property; ao consumidor cabe nomear o que está sendo copiado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const surface = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-surface"]',
    )

    await expect(
      canvas.getByRole('button', { name: 'Copiar e-mail do contato' }),
    ).toBeVisible()
    // Filho de `img` é presentacional: se a superfície virasse `img`, o botão
    // sairia da árvore de acessibilidade mesmo estando no DOM. `getByRole`
    // sozinho não pega isso — por isso o papel da superfície é afirmado aqui.
    await expect(surface?.getAttribute('role')).not.toBe('img')
    await expect(surface?.getAttribute('role')).toBe('group')
  },
}

export const WithCopyOnHover: Story = {
  args: {
    ariaLabel: 'E-mail',
    copyLabel: 'Copiar e-mail do contato',
    trailingVisibility: 'hover',
    icon: MailIcon,
    value: 'mariana@exemplo.com.br',
  },
  parameters: {
    docs: {
      description: {
        story:
          "`trailingVisibility='hover'` guarda a afordância até o ponteiro chegar, e o espaço dela continua reservado — a fileira não salta. Serve à lateral onde toda fileira oferece a mesma ação e a coluna de ícones repetidos disputa a leitura com os valores. Teclado e toque continuam alcançando: `focus-within` e `pointer-coarse` revelam sem hover.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const copyButton = canvas.getByRole('button', {
      name: 'Copiar e-mail do contato',
    })
    const affordance = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-trailing"]',
    )

    await expect(affordance).not.toBeNull()
    if (!affordance) return

    // Em repouso a afordância não se vê, mas continua ocupando o espaço dela: a
    // fileira não salta quando ela aparece.
    await expect(getComputedStyle(affordance).opacity).toBe('0')
    await expect(affordance.getBoundingClientRect().width).toBeGreaterThan(0)

    // O caminho do teclado é o que esta story protege. O do ponteiro não cabe
    // aqui: `userEvent.hover` despacha evento sintético, e `:hover` do CSS só
    // responde a ponteiro real — a revelação por hover se confere no navegador.
    copyButton.focus()
    await waitFor(() => expect(getComputedStyle(affordance).opacity).toBe('1'))
  },
}

export const Empty: Story = {
  args: {
    ariaLabel: 'Category',
    copyLabel: 'Copy category',
    fallback: 'No category',
    icon: ShapesIcon,
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sem valor, a cópia não aparece mesmo pedida: copiar o texto de ausência entregaria "No category" à área de transferência.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-surface"]',
    )

    await expect(
      canvasElement.querySelector('[data-slot="text-property-copy"]'),
    ).toBeNull()
    // Ausência recua para o tom de placeholder: sem isso o fallback se lê com o
    // mesmo peso de um valor preenchido.
    await expect(surface?.dataset.empty).toBe('true')
  },
}

export const EmptyWithTrigger: Story = {
  args: {
    ariaLabel: 'Telefone',
    fallback: 'Sem telefone',
    icon: PhoneIcon,
    inputPlaceholder: '+55 81 3333-0000',
    onCommit: fn(),
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Vazia e editável, a property oferece o preenchimento em vez de só declarar a ausência — é a mesma anatomia do `+` de `TagsProperty` e do gatilho de `EmailProperty`. Clicar troca o gatilho pelo campo, no lugar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Sem telefone' }))
    const field = await canvas.findByRole<HTMLInputElement>('textbox', {
      name: 'Telefone',
    })

    await expect(field).toBeVisible()
    // O gatilho dizia que não há valor; o campo ensina como o valor se escreve.
    await expect(field.placeholder).toBe('+55 81 3333-0000')
  },
}

export const EditableInline: Story = {
  args: {
    ariaLabel: 'E-mail',
    editing: 'inline',
    fallback: 'Sem e-mail',
    icon: MailIcon,
    onCommit: fn(),
    value: 'mariana@exemplo.com.br',
  },
  parameters: {
    docs: {
      description: {
        story:
          'O campo ocupa o lugar do valor desde o início: clicar já é escrever, sem gatilho intermediário. Serve à unidade que é vitrine de um cadastro, onde a fileira existe para ser preenchida. O commit é no `blur`, contrato de `EditableText`.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'E-mail' })

    await userEvent.clear(field)
    await userEvent.type(field, 'nova@exemplo.com.br')
    await userEvent.tab()

    await waitFor(() =>
      expect(args.onCommit).toHaveBeenCalledWith('nova@exemplo.com.br'),
    )
  },
}
