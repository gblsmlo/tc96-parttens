import type { ArgTypes } from '@storybook/react-vite'
import { ptBRPropertyLabels } from '../../properties-labels.ts'

export const phoneInputCountries = ['BR', 'PT', 'US'] as const

export interface PhoneInputControls {
  ariaLabel: string
  defaultCountry: (typeof phoneInputCountries)[number]
  disabled: boolean
  invalid: boolean
  labelsCountry: string
  labelsCountryEmpty: string
  labelsCountryList: string
  labelsCountrySearch: string
  placeholder: string
  readOnly: boolean
  value: string
}

export const phoneInputControlArgs: PhoneInputControls = {
  ariaLabel: 'Telefone',
  defaultCountry: 'BR',
  disabled: false,
  invalid: false,
  labelsCountry: ptBRPropertyLabels.phoneInput.country,
  labelsCountryEmpty: ptBRPropertyLabels.phoneInput.countryEmpty,
  labelsCountryList: ptBRPropertyLabels.phoneInput.countryList,
  labelsCountrySearch: ptBRPropertyLabels.phoneInput.countrySearch,
  placeholder: '',
  readOnly: false,
  value: '+5511987654321',
}

export const phoneInputControlArgTypes: Partial<ArgTypes<PhoneInputControls>> =
  {
    ariaLabel: {
      control: 'text',
      description: 'The `ariaLabel` of `PhoneInput`: names the number field.',
    },
    defaultCountry: {
      control: 'inline-radio',
      description:
        'The `defaultCountry` of `PhoneInput`: the country while the number names none; acts when `value` is empty or national.',
      options: phoneInputCountries,
    },
    disabled: {
      control: 'boolean',
      description: 'The `disabled` of `PhoneInput`.',
    },
    invalid: {
      control: 'boolean',
      description:
        'The `invalid` of `PhoneInput`: marks the number field `aria-invalid`.',
    },
    labelsCountry: {
      control: 'text',
      description:
        '`labels.country` of `PhoneInput`: names the country trigger, before `: <country>`.',
    },
    labelsCountryEmpty: {
      control: 'text',
      description:
        '`labels.countryEmpty` of `PhoneInput`, shown in the list when no country matches the search.',
    },
    labelsCountryList: {
      control: 'text',
      description:
        '`labels.countryList` of `PhoneInput`: names the country list.',
    },
    labelsCountrySearch: {
      control: 'text',
      description:
        '`labels.countrySearch` of `PhoneInput`: names the search field of the list and is its placeholder.',
    },
    placeholder: {
      control: 'text',
      description:
        'The `placeholder` of `PhoneInput`, shown in the empty number field; empty passes nothing.',
    },
    readOnly: {
      control: 'boolean',
      description:
        'The `readOnly` of `PhoneInput`: the number cannot be typed and the country cannot be changed.',
    },
    value: {
      control: 'text',
      description:
        'The initial `value` of `PhoneInput`, in E.164 (`+5511987654321`); empty passes `null`. Typing replaces it.',
    },
  }
