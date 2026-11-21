export const inactiveItemContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector:
            '*:not([data-slot="segmented-control-item"]:not([data-checked]):not([aria-current="page"]):not([data-pressed]))',
        },
      ],
    },
  },
}
