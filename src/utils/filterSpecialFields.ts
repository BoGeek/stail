/**
 * This method filter props that begins with $ sign
 */
export function filterSpecialFields<C>(key: PropertyKey): key is keyof C {
  return typeof key === 'string' ? key.indexOf('$') === -1 : true
}
