import type {
  ComponentProps,
  ComponentType,
  FC,
  JSXElementConstructor,
} from 'react'
import { domElements, makePropFilter } from '@stail/core'
import type { DecoratedComponent } from './utils/symbols.js'
import createStailedComponent, {
  type CreateStailedComponent,
} from './createStailedComponent.js'

export type PropsOf<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = JSX.LibraryManagedAttributes<C, ComponentProps<C>>

export interface StailedOptions {
  /**
   * Helpful for React DevTools
   */
  displayName?: string
  /**
   * Tells Stail which props it should pass to the wrapped component
   *
   * ```ts
   * const MyButton = stail(Button, {
   *   shouldForwardProp: (prop) => !['open', 'active'].includes(prop)
   * })` ... `
   *
   * <MyButton
   *   // Will be forwarded to original Button component
   *   onClick={handler}
   *   // Will not be forwarded to original Button component
   *   open={false}
   * />
   * ```
   */
  shouldForwardProp?(propName: PropertyKey): boolean
  /**
   * Strip props starting from `$`.
   * Enabled for DOM elements, can be enabled for other components.
   *
   * ```ts
   * const Wrapper = stail.div`${props => props.$open ? 'block' : 'hidden'}`
   * <Wrapper
   *   // Will be stripped from resulting dom
   *   $open={true}
   *   // Will be in resulting dom
   *   open={true}
   * />
   * ```
   */
  stripSpecialProps?: boolean

  /**
   * Let you exclude classNames from original Stail component instead of overriding them.
   * ```ts
   * const Button = stail.div`rounded py-2 px-4 bg-gray-500 text-white`
   *
   * const FlatButton = stail(Button, {
   *   exclude: ['rounded', 'bg-gray-500 text-white']
   * })`bg-white border border-gray-500 text-gray-500`
   *
   * render(<><Button>I'm rounded</Button><FlatButton>I'm Flat</FlatButton></>)
   * ```
   */
  excludeClassNames?: string[]
}

export interface BaseCreateStailed {
  <
    C extends ComponentType<ComponentProps<C>>,
    ForwardedProps extends keyof ComponentProps<C> = keyof ComponentProps<C>,
  >(
    component: C,
    options: StailedOptions,
  ): CreateStailedComponent<Pick<PropsOf<C>, ForwardedProps>>

  <C extends ComponentType<ComponentProps<C>>>(
    component: C,
    options?: StailedOptions,
    // @ts-ignore
  ): CreateStailedComponent<PropsOf<C>>

  <
    Tag extends keyof JSX.IntrinsicElements,
    ForwardedProps extends keyof JSX.IntrinsicElements[Tag] = keyof JSX.IntrinsicElements[Tag],
  >(
    tag: Tag,
    options: StailedOptions,
  ): CreateStailedComponent<Pick<JSX.IntrinsicElements[Tag], ForwardedProps>>

  <Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
    options?: StailedOptions,
  ): CreateStailedComponent<JSX.IntrinsicElements[Tag]>
}

export type StyledTags = {
  [Tag in keyof JSX.IntrinsicElements]: CreateStailedComponent<
    JSX.IntrinsicElements[Tag]
  >
}

export interface CreateStailed extends BaseCreateStailed, StyledTags {}

const stailRaw: BaseCreateStailed = <
  C extends
    | keyof JSX.IntrinsicElements
    | ComponentType<OriginalProps>
    | DecoratedComponent<OriginalProps>,
  OriginalProps extends object = {},
>(
  Component: C,
  options: StailedOptions = {},
) => {
  const isNativeElement = typeof Component === 'string'
  const propFilter = makePropFilter<OriginalProps, OriginalProps>(
    typeof options.stripSpecialProps === 'boolean'
      ? options.stripSpecialProps
      : isNativeElement,
    options.shouldForwardProp,
  )
  return createStailedComponent<OriginalProps, C>(
    Component,
    propFilter,
    options.displayName,
    options.excludeClassNames,
  )
}
const stail = stailRaw as CreateStailed

domElements.forEach((item) => {
  // @ts-ignore
  stail[item] = stail(item)
})

export default stail
