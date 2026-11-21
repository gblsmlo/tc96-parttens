export const textareaSizeNames = ['sm', 'default', 'lg'] as const

export type TextareaSizeName = (typeof textareaSizeNames)[number]
