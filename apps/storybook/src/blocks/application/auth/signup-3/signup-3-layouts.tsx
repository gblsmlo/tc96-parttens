import {
  Signup3,
  type Signup3Props,
} from '@tc96/blocks/application/auth/signup-3'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Signup3Controls } from './signup-3-controls.ts'

type ComposedSignup3Props = Readonly<
  Signup3Controls & Partial<Pick<Signup3Props, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const signup3Heading = (
  <>
    O CRM que faz seu time <span className="text-primary">vender mais</span>
  </>
)

export const signup3Brands = (
  <>
    {['Nimbus', 'Orbita', 'Vértice', 'Lumen', 'Quanta'].map((brand) => (
      <span className="font-semibold text-lg" key={brand}>
        {brand}
      </span>
    ))}
  </>
)

export const ComposedSignup3 = ({
  badge,
  brands,
  emailError,
  error,
  onProviderSelect = ignore,
  onSubmit = ignore,
  passwordError,
  pending,
  providers,
}: ComposedSignup3Props) => (
  <Signup3
    badge={badge || undefined}
    brands={brands ? signup3Brands : undefined}
    brandsLabel={brands ? 'Times que já vendem mais com a Acme' : undefined}
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    labels={{ heading: signup3Heading }}
    loginHref="/login"
    logo={authLogo}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    privacyHref="/privacy"
    providers={providers ? authProviders : undefined}
    termsHref="/terms"
  />
)
