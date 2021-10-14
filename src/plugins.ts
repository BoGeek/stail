// @ts-nocheck
import plugin from 'tailwindcss/plugin'
import { transformAllClasses } from 'tailwindcss/lib/util/pluginUtils'

export interface ChildConfig {
  tags: string[]
}

export const defaultChildConfig: ChildConfig = {
  tags: ['svg', 'div', 'span'],
}

export function child({ tags }: ChildConfig = defaultChildConfig) {
  return plugin(({ addVariant }) => {
    addVariant(
      'child',
      transformAllClasses(
        (selector: string) => {
          return `child\:${selector} > *`
        },
        {
          withRule(rule) {
            rule.selector = rule.selector.replace('\\ \\>\\ \\*', ' > *')
          },
        },
      ),
    )
    for (const tag of tags) {
      addVariant(
        `child-${tag}`,
        transformAllClasses(
          (selector: string) => {
            return `child-${tag}\:${selector}>${tag}`
          },
          {
            withRule(rule) {
              rule.selector = rule.selector.replace(`\\>${tag}`, ` > ${tag}`)
            },
          },
        ),
      )
    }
  })
}
