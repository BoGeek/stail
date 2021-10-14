// export interface ArrayInterpolation<Props>
//   extends Array<Interpolation<Props>> {}

export interface FunctionInterpolation<Props> {
  (props: Props): string | undefined | null | false
}

export type Interpolation<Props> =
  | InterpolationPrimitive
  // | ArrayInterpolation<Props>
  | FunctionInterpolation<Props>

export type InterpolationPrimitive = null | undefined | false | string

export const multilineCommentRegEx = /(\/\*\*?[^\*]*\*\/)/g
export const beginMultilineComment = /(\/\*\*?)/
export const endMultilineComment = /(\*\/)/
export const multipleSpaces = /([\s]{2,})/g
export const singleLineComment = /(\/\/.+)\n/g

/**
 * This method is trying to optimize template string by trimming spaces, removing comments
 * and also optimizing template by including predefined constants from a template.
 *
 * It returns prepared array of strings and functions to be used internally by a component.
 */
export default function prepareTemplate<C>(
  template: readonly string[],
  ...handlers: Interpolation<C>[]
) {
  // Initial cleanup from full comments and multiple spaces
  const clearTemplate = template.map(
    (part) =>
      part
        // Replacing multiline comments like /* some comment */
        .replace(multilineCommentRegEx, ' ')
        .replace(singleLineComment, '')
        .split('\n')
        // Trimming lines
        .map((line) => line.replace(multipleSpaces, ' ').trim()),
    // Removing empty lines and // comments
  )
  if (!handlers.length) {
    return clearTemplate.map((part) =>
      part.filter((line) => line !== '').join(' '),
    )
  }
  const resultTemplate: (string | FunctionInterpolation<C>)[] = []
  let startedMultilineComment = false
  let startedSinglelineComment = false
  clearTemplate.forEach((rawLine, index) => {
    let line = rawLine.join('\n')
    if (startedSinglelineComment) {
      const [, ...parts] = line.split('\n')
      line = parts.join('\n')
      startedSinglelineComment = false
    }
    // Let's check are we in the middle of multiline comment?
    if (startedMultilineComment) {
      // End of multiline comment
      if (endMultilineComment.test(line)) {
        const [, , save] = line.split(endMultilineComment)
        startedMultilineComment = false
        line = save
      } else {
        return
      }
    }
    // Let's check, are we going to start multiline comment?
    if (beginMultilineComment.test(line)) {
      const [save] = line.split(beginMultilineComment)
      startedMultilineComment = true
      resultTemplate.push(save.trim())
      return
    }
    if (line.includes('//')) {
      const [save] = line.split('//')
      resultTemplate.push(save.trim())
      startedSinglelineComment = true
      return
    }
    const handler = handlers[index]
    if (!handler) {
      resultTemplate.push(line.trim())
      return
    }
    if (typeof handler === 'string') {
      line = `${line.trim()} ${handler.trim()}`
      resultTemplate.push(line)
      return
    }
    resultTemplate.push(line.trim())
    resultTemplate.push(handler)
  })

  let previousIsString = false
  return resultTemplate.reduce((target, item) => {
    if (item === '') {
      return target
    }
    if (typeof item === 'string') {
      item = item.replace('\n', ' ').replace(multipleSpaces, ' ')
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
  }, [] as (string | FunctionInterpolation<C>)[])
}
