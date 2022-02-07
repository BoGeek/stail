import cx from './cx'
import { FunctionInterpolation } from './prepareTemplate'

export function buildTemplateToClassName<Props>(
  template: (string | FunctionInterpolation<Props>)[],
  props: Props,
) {
  return cx(
    ...template.map((item) => (typeof item === 'string' ? item : item(props))),
    // @ts-ignore
    props.className,
  )
}
