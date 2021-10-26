import { StailTemplate } from './prepareTemplate'

export default function stripClassNamesFromTemplate(
  oldTemplate: StailTemplate,
  exclude?: (string | undefined | null | false)[],
) {
  // We don't have anything to filter
  if (!exclude || exclude.length === 0) {
    return oldTemplate
  }

  const classesToRemove = new Set(
    exclude
      .map((className) => (className || '').trim().split(' '))
      .flat()
      .map((item) => item.trim())
      .filter((item) => item !== ''),
  )

  // We have something to filter from original template
  if (classesToRemove.size > 0) {
    let template = oldTemplate.map((item) => {
      if (typeof item === 'string') {
        // Make a set from original classNames string
        const classes = new Set(item.split(' '))
        for (const key of classesToRemove.values()) {
          if (classes.has(key)) {
            classes.delete(key)
            // Let's hope there's no duplicates
            classesToRemove.delete(key)
          }
        }
        // Make new className string
        return Array.from(classes.values()).join(' ')
      }
      return item
    })
    // Some classNames can be in handlers
    if (classesToRemove.size) {
      template = template.map((item) => {
        if (typeof item === 'string') {
          return item
        }
        // We are replacing original handler with our own one to filter classNames
        return (props) => {
          const classNames = new Set(
            (item(props) || '')
              .split(' ')
              .map((className) => className.trim())
              .filter((className) => !classesToRemove.has(className)),
          )
          if (classNames.size) {
            return Array.from(classNames.values()).join(' ')
          }
        }
      })
    }
    return template
  }
  return oldTemplate
}
