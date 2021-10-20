import { StailTemplate } from './prepareTemplate'

export default function stripClassNamesFromTemplate(
  oldTemplate: StailTemplate,
  exclude: string[] = [],
) {
  const classesToRemove = new Set(
    exclude
      .map((className) => className.trim().split(' '))
      .flat()
      .map((item) => item.trim())
      .filter((item) => item !== ''),
  )

  if (classesToRemove.size > 0) {
    let template = oldTemplate.map((item) => {
      if (typeof item === 'string') {
        const classes = new Set(item.split(' '))
        for (const key of classesToRemove.values()) {
          if (classes.has(key)) {
            classes.delete(key)
            classesToRemove.delete(key)
          }
        }
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
