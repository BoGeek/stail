import prepareTemplate, {
  FunctionInterpolation,
  InterpolationPrimitive,
} from './prepareTemplate'

/**
 * Simple hash function to generate unique className for a template
 */
export function hashCode(str: string) {
  let hash = 0
  if (str.length == 0) {
    return hash
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(16)
}

export type ContentGenerator = (className: string, line: string) => string

export const basicStyleGenerator: ContentGenerator = (className, line) =>
  `.${className} { ${line} }`
export const hoverStyleGenerator: ContentGenerator = (className, line) =>
  `.${className}:hover { ${line} }`
export const activeStyleGenerator: ContentGenerator = (className, line) =>
  `.${className}:active { ${line} }`

/**
 * A simple function to generate class names from a CSS.
 * Warning! Does not support nesting and/or &:hover {}, etc
 *
 * ```ts
 * const Button = stail.div`
 *   rounded py-2 px-4
 *   ${css`
 *     --tw-gradient-to: hsl(223 13.7% 10%);
 *     --tw-gradient-from: rgba(0, 78, 19, var(--tw-bg-opacity, 1));
 *     --tw-gradient-stops: var(--tw-gradient-from),
 *       var(--tw-gradient-to, hsla(219 14.1% 27.8%/0));
 *     background-image: linear-gradient(
 *       to bottom right,
 *       var(--tw-gradient-stops)
 *     );
 *   `}
 * `
 * ```
 *
 * Usage of this helper is not recommended, because:
 *
 * 1. It doesn't support nesting
 * 2. It doesn't support prefixing
 * 3. It doesn't have any bundle-time optimization like any other CSS-in-JS library has
 * 4. Does not support SSR
 *
 * @experimental
 */
export default function css(
  template: TemplateStringsArray,
  ...handlers: InterpolationPrimitive[]
) {
  return prepareTemplate(template, ...handlers)
    .map(makeInjector(basicStyleGenerator))
    .join(' ')
}

/**
 *
 */
export function hover(
  template: TemplateStringsArray,
  ...handlers: InterpolationPrimitive[]
) {
  return prepareTemplate(template, ...handlers)
    .map(makeInjector(hoverStyleGenerator))
    .join(' ')
}

export function active(
  template: TemplateStringsArray,
  ...handlers: InterpolationPrimitive[]
) {
  return prepareTemplate(template, ...handlers)
    .map(makeInjector(activeStyleGenerator))
    .join(' ')
}

export function makeInjector(generator: ContentGenerator) {
  const inject = typeof document !== 'undefined'
  return (line: string | FunctionInterpolation<any>) => {
    if (typeof line !== 'string') {
      throw new Error('css helper does not support this type of interpolation')
    }
    const className = `stail-${hashCode(line)}`
    // Generate className for SSR, but do not insert it to the DOM
    if (inject) {
      const style =
        // Try to select previous style
        document.querySelector(`[data-stail-id="${className}"]`) ||
        document.createElement('style')
      style.setAttribute('data-stail-id', className)
      style.innerHTML = generator(className, line)
      document.head.appendChild(style)
    }
    return className
  }
}
