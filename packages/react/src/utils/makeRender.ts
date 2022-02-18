// The ref's in this file makes TS server run like a crazy, so please
// remove this line only when it'll be resolved
import React from 'react'
import runtime from 'react/jsx-runtime.js'
import { buildTemplateToClassName, type StailTemplate } from '@stail/core'
import type { DecoratedComponent } from './symbols.js'

export interface SpecificStailProps<C> {
  as?: C
}

export default function makeRender<
  C extends
    | keyof JSX.IntrinsicElements
    | React.ComponentType<ForwardedProps>
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

  return React.forwardRef<any, ComponentProps>(
    (originalProps: ComponentProps, ref) => {
      const { as: As = TargetComponent, ...props } = originalProps
      const className = buildTemplateToClassName<BetweenProps>(
        template,
        props as BetweenProps,
      )
      return (
        // @ts-ignore It's trying to use all possible combinations of tags here
        runtime.jsx(As
        // @ts-ignore refs for unknown elements are hard for TS
        , { ...filter(props), ref: ref, className: className }, void 0))
    },
  )
}
