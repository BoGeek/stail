import { filterSpecialFields } from './filterSpecialFields'

export type PropFilter<C> = (prop: PropertyKey) => boolean

/**
 * This method is using to exclude props that we should not pass to the child component.
 * By default it's also stripping $ props for native elements
 */
export default function makePropFilter<
  P extends object,
  C extends Partial<P> = Partial<P>,
>(
  isNativeElement: boolean,
  componentPropFilter?: PropFilter<C>,
): ((props: P) => C) | ((props: P) => P) {
  if (isNativeElement && componentPropFilter) {
    return (props: P): C => {
      let filtered = false
      const keys = (Object.keys(props) as (keyof P)[]).filter((key) => {
        if (componentPropFilter(key) && filterSpecialFields(key)) return true
        filtered = true
        return false
      })
      if (!filtered) return props as unknown as C
      return keys.reduce(
        (target, key) => ({
          ...target,
          [key]: props[key],
        }),
        {} as C,
      )
    }
  } else if (isNativeElement) {
    return (props: P): C => {
      let filtered = false
      const keys = (Object.keys(props) as (keyof P)[]).filter((key) => {
        if (filterSpecialFields(key)) return true
        filtered = true
        return false
      })
      if (!filtered) return props as unknown as C
      return keys.reduce(
        (target, key) => ({
          ...target,
          [key]: props[key],
        }),
        {} as C,
      )
    }
  } else if (componentPropFilter) {
    return (props: P): C => {
      let filtered = false
      const keys = (Object.keys(props) as (keyof P)[]).filter((key) => {
        if (componentPropFilter(key)) return true
        filtered = true
        return false
      })
      if (!filtered) return props as unknown as C
      return keys.reduce(
        (target, key) => ({
          ...target,
          [key]: props[key],
        }),
        {} as C,
      )
    }
  } else {
    return (props: P) => props
  }
}
