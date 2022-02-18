export interface FunctionInterpolation<Props> {
  (props: Props): string | undefined | null | false
}

// Some CSS-in-JS libraries returns object for a css helper
export interface StyledInterpolation {
  name: string
  styles: string
  map: string
}

export type Interpolation<Props> =
  | InterpolationPrimitive
  | StyledInterpolation
  | FunctionInterpolation<Props>

export type StailTemplate<Props = any> = (
  | string
  | FunctionInterpolation<Props>
)[]

export type InterpolationPrimitive = null | undefined | false | string

/**
 * Match "// some" comments
 */
export const singleLineCommentRegEx = /(\/\/.+)\n/g
/**
 * Match multiline comments blocks beginning from /**
 */
export const multilineCommentRegEx = /(\/\*\*?[^\*]*\*\/)/g
/**
 * Spaces on beginning of the line
 */
export const beginLineSpacesRegEx = /^([^\S\r\n]+)/gm
/**
 * Trailing spaces on end of the lines
 */
export const endLineSpacesRegEx = /([^\S\r\n]+)$/g
/**
 * Spaces like "some  thing     s"
 */
export const multipleSpacesRegEx = /([^\S\r\n]{2,})/g
/**
 * Line that doesn't have anything
 */
export const emptyLineRegEx = /([\s]+\n?)$|(?<=\n)([^\S\r\n]*\n)/g

export const beginMultilineCommentRegEx = /(\/\*\*?)/
export const endMultilineCommentRegEx = /(\*\/)/
export const newLineRegEx = /\n/g

export const isStyledInterpolation = (
  handler: Interpolation<any>,
): handler is StyledInterpolation =>
  typeof handler === 'object' && !!handler?.name

export function initialCleanUp(template: readonly string[]) {
  return template.map((part) =>
    part
      .replace(singleLineCommentRegEx, '')
      .replace(multilineCommentRegEx, ' ')
      .replace(beginLineSpacesRegEx, '')
      .replace(endLineSpacesRegEx, '')
      .replace(multipleSpacesRegEx, ' ')
      .replace(emptyLineRegEx, ''),
  )
}

/**
 * This method is trying to optimize template string by trimming spaces, removing comments
 * and also optimizing template by including predefined constants from a template.
 *
 * It returns prepared array of strings and functions to be used internally by a component.
 */
export function prepareTemplate<C>(
  template: readonly string[],
  ...handlers: Interpolation<C>[]
) {
  // Initial cleanup from full comments and multiple spaces
  const clearTemplate = initialCleanUp(template)
  if (!handlers.length) {
    return clearTemplate.map((part) => part.trim().replace(/\n/g, ' '))
  }
  const resultTemplate: StailTemplate<C> = []
  let startedMultilineComment = false
  let startedSinglelineComment = false
  clearTemplate.forEach((part, index) => {
    // 1. Remove first line if previous part had unfinished single line comment
    if (startedSinglelineComment) {
      const [, ...parts] = part.split('\n')
      part = parts.join('\n')
      startedSinglelineComment = false
    }
    // 2. If previous part had started multiline comment, let's check for an end.
    if (startedMultilineComment) {
      // Multiline comment ended, lets remove what commented
      if (endMultilineCommentRegEx.test(part)) {
        const [, , save] = part.split(endMultilineCommentRegEx)
        startedMultilineComment = false
        part = save
      } else {
        // Multiline comment doesn't finished, ignore all part and handler
        return
      }
    }
    // 3. Let's check this part for starting single line comment, it should be marked and saved only some parts
    if (part.includes('//')) {
      const [save] = part.split('//')
      resultTemplate.push(save.trim())
      startedSinglelineComment = true
      return
    }
    // 4. Let's check for beginning multiline comment
    if (beginMultilineCommentRegEx.test(part)) {
      const [save] = part.split(beginMultilineCommentRegEx)
      startedMultilineComment = true
      resultTemplate.push(save.trim())
      return
    }
    // 5. Get associated handler
    const handler = handlers[index]
    // 6. If there's no one, just push the template
    if (!handler) {
      resultTemplate.push(part.trim())
      return
    }
    // 7. Handler is a static string, let's add it to part
    if (typeof handler === 'string') {
      part = `${part.trim()} ${handler.trim()}`
      resultTemplate.push(part)
      return
    }
    // 8. Handler is styled object, let's get resulted className and add it to part
    else if (isStyledInterpolation(handler)) {
      part = `${part.trim()} ${handler.name}`
      resultTemplate.push(part)
      return
    }
    // 9. Finally, let's add part and handler to result template
    resultTemplate.push(part.trim())
    resultTemplate.push(handler)
  })

  let previousIsString = false
  // Let's optimize resulting array by merging strings and removing empty parts for result array
  return resultTemplate.reduce((target, item) => {
    // Some parts can be empty after processing them
    if (item === '') {
      return target
    }
    if (typeof item === 'string') {
      item = item.replace(/\n/g, ' ')
      if (previousIsString) {
        // @ts-ignore
        target[target.length - 1] = `${target[target.length - 1]} ${item}`
        return target
      }
      previousIsString = true
    } else {
      previousIsString = false
    }
    target.push(item)
    return target
  }, [] as StailTemplate<C>)
}
