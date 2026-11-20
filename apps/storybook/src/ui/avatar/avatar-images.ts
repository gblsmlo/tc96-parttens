interface Person {
  initials: string
  name: string
  photo: string
}

const portrait = (background: string, skin: string, shirt: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="${background}"/><circle cx="48" cy="40" r="18" fill="${skin}"/><path d="M12 96c4-22 18-34 36-34s32 12 36 34z" fill="${shirt}"/></svg>`,
  )}`

export const brokenPhoto = 'data:image/png;base64,AAAA'

export const ana: Person = {
  initials: 'AS',
  name: 'Ana Souza',
  photo: portrait('#bfdbfe', '#d6a77a', '#1e3a8a'),
}

export const bruno: Person = {
  initials: 'BL',
  name: 'Bruno Lima',
  photo: portrait('#fde68a', '#8d5524', '#7c2d12'),
}

export const carla: Person = {
  initials: 'CM',
  name: 'Carla Mendes',
  photo: portrait('#bbf7d0', '#f1c27d', '#14532d'),
}

export const diego: Person = {
  initials: 'DR',
  name: 'Diego Rocha',
  photo: portrait('#fecaca', '#c68642', '#4c1d95'),
}

export const elisa: Person = {
  initials: 'EP',
  name: 'Elisa Prado',
  photo: portrait('#e9d5ff', '#e0ac69', '#0f172a'),
}
