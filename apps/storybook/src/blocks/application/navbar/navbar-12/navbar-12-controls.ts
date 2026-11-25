import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar12Controls {
  openOnHover: boolean
  showCta: boolean
  showLogo: boolean
  showPricing: boolean
}

export const navbar12ControlArgs: Navbar12Controls = {
  openOnHover: false,
  showCta: true,
  showLogo: true,
  showPricing: true,
}

export const navbar12ControlArgTypes: Partial<ArgTypes<Navbar12Controls>> = {
  openOnHover: {
    control: 'boolean',
    description: 'The `openOnHover` prop; menus also open when hovered.',
  },
  showCta: {
    control: 'boolean',
    description: 'Passes `cta`; without it no call to action renders.',
  },
  showLogo: {
    control: 'boolean',
    description: 'Passes `logo`; without it only the name renders.',
  },
  showPricing: {
    control: 'boolean',
    description: 'Keeps the plain Preços link beside the two menus.',
  },
}
