import type { z } from 'zod'

export type EntryParseResult =
  | { success: true; value: string }
  | { success: false; message: string }

export type EntryParser = (raw: string) => EntryParseResult

export function createEntryParser(
  schema: z.ZodType<string>,
  fallbackMessage: string,
): EntryParser {
  return (raw) => {
    const parsed = schema.safeParse(raw)

    if (parsed.success) return { success: true, value: parsed.data }

    return {
      message: parsed.error.issues[0]?.message ?? fallbackMessage,
      success: false,
    }
  }
}
