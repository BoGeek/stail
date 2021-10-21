import { FC, ComponentType } from 'react'
import { FunctionInterpolation } from './prepareTemplate'

export const StailComponent = Symbol('StailComponent')

export const StailTemplate = Symbol('StailTemplate')

export const StailFilter = Symbol('StailFilter')

export interface DecoratedComponent<Props, ForwardedProps = Props>
  extends FC<Props> {
  [StailComponent]: keyof JSX.IntrinsicElements | ComponentType<ForwardedProps>
  [StailTemplate]: (string | FunctionInterpolation<Props>)[]
  [StailFilter]: (props: Props) => ForwardedProps
}

export function decorate<Props, ForwardedProps = Props>(
  component: FC<Props>,
  template: (string | FunctionInterpolation<Props>)[],
  decoratedComponent:
    | keyof JSX.IntrinsicElements
    | ComponentType<ForwardedProps>,
  filter: (props: Props) => ForwardedProps,
): DecoratedComponent<Props, ForwardedProps> {
  // @ts-ignore
  component[StailComponent] = decoratedComponent
  // @ts-ignore
  component[StailTemplate] = template
  // @ts-ignore
  component[StailFilter] = filter
  // @ts-ignore
  return component
}

export function isStailComponent(
  component: ComponentType<any>,
): component is DecoratedComponent<any> {
  // @ts-ignore
  return !!component[StailComponent]
}
