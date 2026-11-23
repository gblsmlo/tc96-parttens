export function checklistProgressLabel(
  completed: number,
  total: number,
): string {
  return `${completed} de ${total} ${total === 1 ? 'concluído' : 'concluídos'}`
}
