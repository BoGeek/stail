// The ref's in this file makes TS server run like a crazy, so please
// remove this line only when it'll be resolved
// @ts-nocheck
import { forwardRef, ComponentType } from 'react'
import buildTemplateToClassName from './buildTemplateToClassName'
import { StailTemplate } from './prepareTemplate'
import { DecoratedComponent } from './symbols'

export interface SpecificStailProps<C> {
  as?: C
}

export default function makeRender<
  C extends
    | keyof JSX.IntrinsicElements
    | ComponentType<ForwardedProps>
    | DecoratedComponent<ForwardedProps>,
  AdditionalProps,
  ForwardedProps,
>(
  TargetComponent: C,
  template: StailTemplate,
  filter: (props: any) => ForwardedProps,
) {
  type BetweenProps = ForwardedProps & AdditionalProps
  type ComponentProps = ForwardedProps & AdditionalProps & SpecificStailProps<C>

  return forwardRef<any, ComponentProps>(
    (originalProps: ComponentProps, ref) => {
      const { as: As = TargetComponent, ...props } = originalProps
      const className = buildTemplateToClassName<BetweenProps>(
        template,
        props as BetweenProps,
      )
      return (
        // @ts-ignore It's trying to use all possible combinations of tags here
        <As
          // @ts-ignore refs for unknown elements are hard for TS
          {...filter(props as BetweenProps)}
          ref={ref}
          className={className}
        />
      )
    },
  )
}
