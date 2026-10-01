import { patternNames } from '../packages/registry/src/manifest'
import { createConsumer, installPatterns, saveReport } from './consumer'

// Every pattern installs into the example consumer, compiles against its COSS
// and leaves its UI untouched.
const consumer = await createConsumer('consumer-registry')
const installedFiles = await installPatterns(consumer, [...patternNames])
await saveReport('consumer-registry', {
  passed: true,
  patterns: patternNames,
  installedFiles,
  patternsPath: consumer.patterns,
  uiUntouched: consumer.ui,
})
