import { StarIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import {
  Login10,
  type Login10FooterLink,
  type Login10Props,
  type Login10Testimonial,
} from '@tc96/ui/blocks/application/auth/login-10'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login10Controls } from './login-10-controls.ts'

type ComposedLogin10Props = Readonly<
  Login10Controls & Partial<Pick<Login10Props, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const login10Testimonials: Login10Testimonial[] = [
  {
    avatar: (
      <Avatar>
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
    ),
    name: 'Ana Souza',
    quote: 'Em uma semana, o time passou a resolver tudo em um só lugar.',
    role: 'Diretora de operações na Acme',
  },
  {
    avatar: (
      <Avatar>
        <AvatarFallback>BL</AvatarFallback>
      </Avatar>
    ),
    name: 'Bruno Lima',
    quote: 'Cortamos pela metade o tempo de resposta aos clientes.',
    role: 'Gerente de suporte na Nimbus',
  },
  {
    avatar: (
      <Avatar>
        <AvatarFallback>CR</AvatarFallback>
      </Avatar>
    ),
    name: 'Carla Rocha',
    quote: 'Agora cada vendedor sabe exatamente qual é o próximo passo.',
    role: 'Head de vendas na Orbita',
  },
]

export const login10FooterLinks: Login10FooterLink[] = [
  { href: '/terms', label: 'Termos' },
  { href: '/privacy', label: 'Privacidade' },
  { href: '/help', label: 'Ajuda' },
]

export const login10Rating = (
  <div className="flex gap-0.5 text-warning">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon aria-hidden key={star} weight="fill" />
    ))}
    <span className="sr-only">Nota 5 de 5</span>
  </div>
)

export const ComposedLogin10 = ({
  emailError,
  error,
  footer,
  onProviderSelect = ignore,
  onSubmit = ignore,
  passwordError,
  pending,
  providers,
  rating,
  testimonials,
}: ComposedLogin10Props) => (
  <Login10
    copyright={footer ? '© 2026 Acme' : undefined}
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    footerLinks={footer ? login10FooterLinks : undefined}
    forgotPasswordHref="/forgot-password"
    logo={authLogo}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    proof={rating ? 'Mais de 2.000 times confiam na Acme' : undefined}
    providers={
      providers
        ? [...authProviders, { id: 'microsoft', label: 'Microsoft' }]
        : undefined
    }
    rating={rating ? login10Rating : undefined}
    signupHref="/signup"
    testimonials={testimonials ? login10Testimonials : undefined}
  />
)
