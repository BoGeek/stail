import { filterSpecialFields } from './filterSpecialFields'

export type PropFilter<C> = (prop: PropertyKey) => boolean

/**
 * This method is excluding props that we should not pass to the child component.
 * By default it's also stripping props starting from $ for native elements
 */
export function makePropFilter<
  P extends object,
  C extends Partial<P> = Partial<P>,
>(
  isNativeElement: boolean,
  componentPropFilter?: PropFilter<C>,
): ((props: P) => C) | ((props: P) => P) {
  const keysFilter: PropFilter<C>[] = []
  if (isNativeElement) {
    keysFilter.push(filterSpecialFields)
  }
  if (componentPropFilter) {
    keysFilter.push(componentPropFilter)
  }
  if (keysFilter.length) {
    return (props: P): C => {
      let filtered = false
      const keys = (Object.keys(props) as (keyof P)[]).filter((key) => {
        if (keysFilter.every((checker) => checker(key))) {
          return true
        }
        filtered = true
        return false
      })
      // Return original props object so it will pass === condition
      if (!filtered) {
        return props as unknown as C
      }
      // Map new props based on selected keys
      return keys.reduce(
        (target, key) => ({
          ...target,
          [key]: props[key],
        }),
        {} as C,
      )
    }
  }
  return (props) => props
}
