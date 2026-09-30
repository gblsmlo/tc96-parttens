# Mapa de migração

A base permanece intacta. Modules normalizados iguais são unificados. Diferenças de contrato ficam explicitamente em `ui/compat`, não em cópias dentro de padrões. A redução adicional das variantes depende de preservar props e aparência.

| Origem | Destino em packages | Tratamento |
|---|---|---|
| `src/shared/ui/avatar.tsx` | `ui/src/avatar.tsx` | Contrato preservado |
| `src/shared/ui/badge.tsx` | `ui/src/badge.tsx` | Contrato preservado |
| `src/shared/ui/button.tsx` | `ui/src/button.tsx` | Contrato preservado |
| `src/shared/ui/calendar.tsx` | `ui/src/calendar.tsx` | Contrato preservado |
| `src/shared/ui/field.tsx` | `ui/src/field.tsx` | Contrato preservado |
| `src/shared/ui/form.tsx` | `ui/src/form.tsx` | Contrato preservado |
| `src/shared/ui/group.tsx` | `ui/src/group.tsx` | Contrato preservado |
| `src/shared/ui/input-group.tsx` | `ui/src/input-group.tsx` | Contrato preservado |
| `src/shared/ui/input.tsx` | `ui/src/input.tsx` | Contrato preservado |
| `src/shared/ui/kbd.tsx` | `ui/src/kbd.tsx` | Contrato preservado |
| `src/shared/ui/menu.tsx` | `ui/src/menu.tsx` | Contrato preservado |
| `src/shared/ui/popover.tsx` | `ui/src/popover.tsx` | Contrato preservado |
| `src/shared/ui/separator.tsx` | `ui/src/separator.tsx` | Contrato preservado |
| `src/shared/ui/spinner.tsx` | `ui/src/spinner.tsx` | Contrato preservado |
| `src/shared/ui/text.tsx` | `ui/src/text.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/badge.tsx` | `ui/src/badge.tsx` | Compartilhado |
| `src/features/collection-views/components/ui/button.tsx` | `ui/src/compat/collection-views/button.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/card.tsx` | `ui/src/card.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/checkbox.tsx` | `ui/src/checkbox.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/collapsible.tsx` | `ui/src/collapsible.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/empty.tsx` | `ui/src/empty.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/input.tsx` | `ui/src/compat/collection-views/input.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/menu.tsx` | `ui/src/menu.tsx` | Compartilhado |
| `src/features/collection-views/components/ui/pagination.tsx` | `ui/src/pagination.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/popover.tsx` | `ui/src/popover.tsx` | Compartilhado |
| `src/features/collection-views/components/ui/scroll-area.tsx` | `ui/src/scroll-area.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/select.tsx` | `ui/src/select.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/skeleton.tsx` | `ui/src/skeleton.tsx` | Contrato preservado |
| `src/features/collection-views/components/ui/spinner.tsx` | `ui/src/spinner.tsx` | Compartilhado |
| `src/features/collection-views/components/ui/toolbar.tsx` | `ui/src/toolbar.tsx` | Contrato preservado |
| `src/features/properties/components/ui/avatar.tsx` | `ui/src/avatar.tsx` | Compartilhado |
| `src/features/properties/components/ui/badge.tsx` | `ui/src/badge.tsx` | Compartilhado |
| `src/features/properties/components/ui/button.tsx` | `ui/src/compat/collection-views/button.tsx` | Compartilhado |
| `src/features/properties/components/ui/calendar.tsx` | `ui/src/calendar.tsx` | Compartilhado |
| `src/features/properties/components/ui/combobox.tsx` | `ui/src/combobox.tsx` | Contrato preservado |
| `src/features/properties/components/ui/field.tsx` | `ui/src/field.tsx` | Compartilhado |
| `src/features/properties/components/ui/input-group.tsx` | `ui/src/compat/properties/input-group.tsx` | Contrato preservado |
| `src/features/properties/components/ui/input.tsx` | `ui/src/compat/collection-views/input.tsx` | Compartilhado |
| `src/features/properties/components/ui/menu.tsx` | `ui/src/menu.tsx` | Compartilhado |
| `src/features/properties/components/ui/popover.tsx` | `ui/src/popover.tsx` | Compartilhado |
| `src/features/properties/components/ui/scroll-area.tsx` | `ui/src/scroll-area.tsx` | Compartilhado |
| `src/features/properties/components/ui/select.tsx` | `ui/src/select.tsx` | Compartilhado |
| `src/features/properties/components/ui/spinner.tsx` | `ui/src/spinner.tsx` | Compartilhado |
| `src/features/properties/components/ui/textarea.tsx` | `ui/src/textarea.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/accordion.tsx` | `ui/src/accordion.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/alert-dialog.tsx` | `ui/src/alert-dialog.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/alert.tsx` | `ui/src/alert.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/autocomplete.tsx` | `ui/src/autocomplete.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/avatar.tsx` | `ui/src/compat/detail-sheet/avatar.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/badge.tsx` | `ui/src/badge.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/breadcrumb.tsx` | `ui/src/breadcrumb.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/button.tsx` | `ui/src/compat/collection-views/button.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/calendar.tsx` | `ui/src/compat/detail-sheet/calendar.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/card.tsx` | `ui/src/card.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/checkbox-group.tsx` | `ui/src/checkbox-group.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/checkbox.tsx` | `ui/src/checkbox.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/collapsible.tsx` | `ui/src/collapsible.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/combobox.tsx` | `ui/src/compat/detail-sheet/combobox.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/command.tsx` | `ui/src/command.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/context-menu.tsx` | `ui/src/context-menu.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/dialog.tsx` | `ui/src/dialog.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/drawer.tsx` | `ui/src/drawer.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/empty.tsx` | `ui/src/empty.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/field.tsx` | `ui/src/field.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/fieldset.tsx` | `ui/src/fieldset.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/form.tsx` | `ui/src/form.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/frame.tsx` | `ui/src/frame.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/group.tsx` | `ui/src/compat/detail-sheet/group.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/input-group.tsx` | `ui/src/compat/detail-sheet/input-group.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/input.tsx` | `ui/src/compat/detail-sheet/input.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/kbd.tsx` | `ui/src/kbd.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/label.tsx` | `ui/src/label.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/menu.tsx` | `ui/src/menu.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/meter.tsx` | `ui/src/meter.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/number-field.tsx` | `ui/src/number-field.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/otp-field.tsx` | `ui/src/otp-field.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/pagination.tsx` | `ui/src/pagination.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/popover.tsx` | `ui/src/popover.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/preview-card.tsx` | `ui/src/preview-card.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/progress.tsx` | `ui/src/progress.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/radio-group.tsx` | `ui/src/radio-group.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/scroll-area.tsx` | `ui/src/compat/detail-sheet/scroll-area.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/select.tsx` | `ui/src/compat/detail-sheet/select.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/separator.tsx` | `ui/src/separator.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/sheet.tsx` | `ui/src/sheet.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/sidebar.tsx` | `ui/src/sidebar.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/skeleton.tsx` | `ui/src/skeleton.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/slider.tsx` | `ui/src/slider.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/spinner.tsx` | `ui/src/spinner.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/switch.tsx` | `ui/src/switch.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/table.tsx` | `ui/src/table.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/tabs.tsx` | `ui/src/tabs.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/textarea.tsx` | `ui/src/compat/detail-sheet/textarea.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/toast.tsx` | `ui/src/toast.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/toggle-group.tsx` | `ui/src/toggle-group.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/toggle.tsx` | `ui/src/toggle.tsx` | Contrato preservado |
| `src/features/detail-sheet/components/ui/toolbar.tsx` | `ui/src/toolbar.tsx` | Compartilhado |
| `src/features/detail-sheet/components/ui/tooltip.tsx` | `ui/src/tooltip.tsx` | Contrato preservado |

Features: `src/features/<pattern>` → `packages/parttens/src/<pattern>`. Registry e scripts migram para `packages/registry`. Filter Builder excluído.
