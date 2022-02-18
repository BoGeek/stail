import { cx } from './cx.js'
import type { FunctionInterpolation } from './prepareTemplate.js'

export function buildTemplateToClassName<Props extends { className?: string }>(
  template: (string | FunctionInterpolation<Props>)[],
  props: Props,
) {
  return cx(
    ...template.map((item) => (typeof item === 'string' ? item : item(props))),
    props.className,
  )
}
