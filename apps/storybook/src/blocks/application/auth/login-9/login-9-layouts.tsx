import {
  Login9,
  type Login9Props,
  type Login9Testimonial,
} from '@tc96/ui/blocks/application/auth/login-9'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login9Controls } from './login-9-controls.ts'

type ComposedLogin9Props = Readonly<
  Login9Controls & Partial<Pick<Login9Props, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const login9Testimonial: Login9Testimonial = {
  author: {
    avatarFallback: 'AS',
    name: 'Ana Souza',
    role: 'Diretora de operações na Acme',
  },
  quote: 'Em uma semana, o time passou a resolver tudo em um só lugar.',
  rating: 5,
}

export const login9BrandsLabel = 'Usado por times de mais de 2.000 empresas'

export const login9Brands = ['Globex', 'Initech', 'Umbrella', 'Hooli'].map(
  (brand) => (
    <span className="font-semibold text-muted-foreground" key={brand}>
      {brand}
    </span>
  ),
)

export const ComposedLogin9 = ({
  brands,
  emailError,
  error,
  onProviderSelect = ignore,
  onSubmit = ignore,
  pending,
  providers,
  rating,
}: ComposedLogin9Props) => (
  <Login9
    brands={brands ? login9Brands : undefined}
    brandsLabel={brands ? login9BrandsLabel : undefined}
    error={error || undefined}
    fieldErrors={emailError ? { email: emailError } : undefined}
    logo={authLogo}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    providers={providers ? authProviders : undefined}
    testimonial={{ ...login9Testimonial, rating }}
  />
)
