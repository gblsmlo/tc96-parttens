export interface SchedulePropertyLabels {
  addReminder: string
  allDay: string
  end: string
  frequency: string
  nextWeek: string
  noDate: string
  noReminders: string
  noRepeat: string
  presets: string
  reminders: string
  removeReminder: string
  repeat: string
  start: string
  thisWeekend: string
  time: string
  today: string
  tomorrow: string
  until: string
  untilFallback: string
}

export const defaultSchedulePropertyLabels: SchedulePropertyLabels = {
  addReminder: 'Adicionar lembrete',
  allDay: 'Dia inteiro',
  end: 'Fim',
  frequency: 'Frequência',
  nextWeek: 'Próxima semana',
  noDate: 'Sem data',
  noReminders: 'Nenhum lembrete encontrado.',
  noRepeat: 'Não repete',
  presets: 'Atalhos de data',
  reminders: 'Lembretes',
  removeReminder: 'Remover lembrete',
  repeat: 'Repetir',
  start: 'Início',
  thisWeekend: 'Este fim de semana',
  time: 'Hora',
  today: 'Hoje',
  tomorrow: 'Amanhã',
  until: 'Até',
  untilFallback: 'Sem término',
}
