import createStailedComponent, {
  CreateStailedComponent,
} from './createStailedComponent'
import {
  ComponentClass,
  ComponentProps,
  Ref,
  ComponentType,
  ElementType,
  FC,
  JSXElementConstructor,
} from 'react'
import domElements from './utils/domElements'
import makePropFilter from './utils/makePropFilter'

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
}

export interface BaseCreateStailed {
  <
    C extends ComponentClass<ComponentProps<C>>,
    ForwardedProps extends keyof ComponentProps<C> = keyof ComponentProps<C>,
  >(
    component: C,
    options: StailedOptions,
  ): CreateStailedComponent<
    Pick<PropsOf<C>, ForwardedProps>,
    {},
    {
      ref?: Ref<InstanceType<C>>
    }
  >

  <C extends ComponentClass<ComponentProps<C>>>(
    component: C,
    options?: StailedOptions,
  ): CreateStailedComponent<
    PropsOf<C>,
    {},
    {
      ref?: Ref<InstanceType<C>>
    }
  >

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
  ): CreateStailedComponent<PropsOf<C>>

  <
    Tag extends keyof JSX.IntrinsicElements,
    ForwardedProps extends keyof JSX.IntrinsicElements[Tag] = keyof JSX.IntrinsicElements[Tag],
  >(
    tag: Tag,
    options: StailedOptions,
  ): CreateStailedComponent<
    { as?: ElementType },
    Pick<JSX.IntrinsicElements[Tag], ForwardedProps>
  >

  <Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
    options?: StailedOptions,
  ): CreateStailedComponent<{ as?: ElementType }, JSX.IntrinsicElements[Tag]>
}

export interface StyledComponent<
  ComponentPropsOriginal extends {},
  SpecificComponentProps extends {} = {},
  JSXProps extends {} = {},
> extends FC<ComponentPropsOriginal & SpecificComponentProps & JSXProps> {}

export type StyledTags = {
  [Tag in keyof JSX.IntrinsicElements]: CreateStailedComponent<
    {
      as?: ElementType
    },
    JSX.IntrinsicElements[Tag]
  >
}
export interface CreateStyled extends BaseCreateStailed, StyledTags {}

// @ts-ignore
const stail: CreateStyled = <P extends object>(
  Component: keyof JSX.IntrinsicElements | ComponentType<P>,
  options: StailedOptions = {},
) => {
  const isNativeElement = typeof Component === 'string'
  const propFilter = makePropFilter<P>(
    options.stripSpecialProps ?? isNativeElement,
    options.shouldForwardProp,
  )
  return createStailedComponent<P>(
    Component,
    propFilter,
    isNativeElement,
    options.displayName,
  )
}

domElements.forEach((item) => {
  stail[item] = stail(item)
})

export default stail
