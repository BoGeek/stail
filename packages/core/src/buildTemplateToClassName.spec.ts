import { describe, expect, it } from '@jest/globals'
import { buildTemplateToClassName } from './buildTemplateToClassName.js'
import type { StailTemplate } from './prepareTemplate.js'

describe('buildTemplateToClassName', () => {
  it('should build classNames from template', () => {
    const template: StailTemplate = [
      'py-4 px-2',
      () => 'rounded',
      'bg-white',
      () => undefined,
      () => null,
    ]
    expect(buildTemplateToClassName(template, {})).toMatchInlineSnapshot(
      `"py-4 px-2 rounded bg-white"`,
    )
    expect(
      buildTemplateToClassName(template, { className: 'text-gray-500' }),
    ).toMatchInlineSnapshot(`"py-4 px-2 rounded bg-white text-gray-500"`)
  })
})
