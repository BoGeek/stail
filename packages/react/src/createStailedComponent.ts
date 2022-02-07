import { ComponentProps, ComponentType, MutableRefObject } from 'react'
import prepareTemplate, {
  StailTemplate as Template,
  type Interpolation,
  stripClassNamesFromTemplate
} from '@stail/core'
import {
  decorate,
  DecoratedComponent,
  isStailComponent,
  StailComponent,
  StailFilter,
  StailTemplate,
} from './utils/symbols'
import makeRender from './utils/makeRender'

export interface CreateStailedComponent<ComponentProps extends {}> {
  (
    template: TemplateStringsArray,
    ...styles: Array<Interpolation<ComponentProps>>
  ): DecoratedComponent<ComponentProps>

  /**
   * @typeparam AdditionalProps  Additional props to add to your styled component
   */
  <AdditionalProps extends {}>(
    template: TemplateStringsArray,
    ...styles: Array<Interpolation<ComponentProps & AdditionalProps>>
  ): DecoratedComponent<ComponentProps & AdditionalProps>
}

export default function createStailedComponent<
  ForwardedProps extends { className?: string; ref?: MutableRefObject<any> },
  C extends
    | keyof JSX.IntrinsicElements
    | ComponentType<ForwardedProps>
    | DecoratedComponent<ForwardedProps>,
>(
  Component: C,
  filterProps: (props: any) => ForwardedProps,
  displayName?: string,
  excludeClassNames?: string[],
) {
  let TargetComponent = Component
  let filter = filterProps
  let baseTemplate: Template = []
  // We are working with a stail component, let's do some magic here
  if (typeof Component !== 'string' && isStailComponent(Component)) {
    // Unwrap target component
    // @ts-ignore
    TargetComponent = Component[StailComponent]
    // Receive original prop filter
    const originalFilter = Component[StailFilter]
    filter = (props) => filterProps(originalFilter(props))
    // Get template from target component and clear it from excluded classNames
    baseTemplate = stripClassNamesFromTemplate(
      Component[StailTemplate],
      excludeClassNames,
    )
  }

  return <AdditionalProps = {}>(
    rawTemplate: TemplateStringsArray,
    ...handlers: Interpolation<ForwardedProps & AdditionalProps>[]
  ) => {
    const template = baseTemplate.concat(
      prepareTemplate(rawTemplate, ...handlers),
    )
    const comp = makeRender<C, AdditionalProps, ForwardedProps>(
      TargetComponent,
      template,
      filter,
    )
    comp.displayName = displayName || `Stailed<${Component}>`
    return decorate<ComponentProps<typeof comp>, ForwardedProps>(
      comp,
      template,
      Component,
      filterProps,
    )
  }
}
