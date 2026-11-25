import type { SettingsIntegration8Item } from '@tc96/ui/blocks/application/settings/integration/settings-integration-8'
import asana from '@thesvg/icons/asana'
import datadog from '@thesvg/icons/datadog'
import discord from '@thesvg/icons/discord'
import figma from '@thesvg/icons/figma'
import github from '@thesvg/icons/github'
import hubspot from '@thesvg/icons/hubspot'
import linear from '@thesvg/icons/linear'
import notion from '@thesvg/icons/notion'
import sentry from '@thesvg/icons/sentry'
import slack from '@thesvg/icons/slack'
import stripe from '@thesvg/icons/stripe'
import twilio from '@thesvg/icons/twilio'

const item = (
  id: string,
  name: string,
  logo: SettingsIntegration8Item['logo'],
  calls: number,
  enabled = true,
): SettingsIntegration8Item => ({
  calls,
  callsLabel: calls.toLocaleString('pt-BR'),
  enabled,
  id,
  keyPreview: `sk_live_••••${id.slice(0, 4)}`,
  logo,
  name,
})

export const settingsIntegration8Items: SettingsIntegration8Item[] = [
  item('github', 'GitHub', github, 18420),
  item('slack', 'Slack', slack, 9310),
  item('stripe', 'Stripe', stripe, 5240),
  item('linear', 'Linear', linear, 3870),
  item('notion', 'Notion', notion, 2960, false),
  item('sentry', 'Sentry', sentry, 12450),
  item('datadog', 'Datadog', datadog, 7780),
  item('hubspot', 'HubSpot', hubspot, 1420),
  item('twilio', 'Twilio', twilio, 640, false),
  item('discord', 'Discord', discord, 2210),
  item('figma', 'Figma', figma, 380),
  item('asana', 'Asana', asana, 920),
]
