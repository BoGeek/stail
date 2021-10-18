import { ComponentType, FC, forwardRef } from 'react'
import buildTemplateToClassName from './utils/buildTemplateToClassName'
import prepareTemplate from './utils/prepareTemplate'
import { Interpolation } from './utils/prepareTemplate'
import { StyledComponent } from './stail'

export interface CreateStailedComponent<
  ComponentProps extends {},
  SpecificComponentProps extends {} = {},
  JSXProps = {},
> {
  (
    template: TemplateStringsArray,
    ...styles: Array<Interpolation<ComponentProps & SpecificComponentProps>>
  ): StyledComponent<ComponentProps, SpecificComponentProps>

  /**
   * @typeparam AdditionalProps  Additional props to add to your styled component
   */
  <AdditionalProps extends {}>(
    template: TemplateStringsArray,
    ...styles: Array<
      Interpolation<ComponentProps & SpecificComponentProps & AdditionalProps>
    >
  ): StyledComponent<ComponentProps & AdditionalProps, SpecificComponentProps>
}

export default function createStailedComponent<
  ComponentProps extends { className?: string },
  SpecificComponentProps extends { as?: ComponentType<ComponentProps> } = {
    as?: ComponentType<ComponentProps>
  },
>(
  Component: keyof JSX.IntrinsicElements | ComponentType<ComponentProps>,
  filterProps: (props: ComponentProps) => Partial<ComponentProps>,
  isNative?: boolean,
  displayName?: string,
) {
  return ((
    rawTemplate: TemplateStringsArray,
    ...handlers: Interpolation<ComponentProps>[]
  ) => {
    const template = prepareTemplate(rawTemplate, ...handlers)
    // Just assign classes
    if (isNative) {
      // @ts-ignore
      const comp: FC<ComponentProps & SpecificComponentProps> = forwardRef(
        ({ as: As, ...props }: ComponentProps & SpecificComponentProps, ref) =>
          As ? (
            // @ts-ignore
            <As
              ref={ref}
              // @ts-ignore
              {...filterProps(props)}
              className={buildTemplateToClassName<ComponentProps>(
                template,
                // @ts-ignore
                props,
              )}
            />
          ) : (
            // @ts-ignore
            <Component
              // @ts-ignore
              ref={ref}
              // @ts-ignore
              {...filterProps(props)}
              className={buildTemplateToClassName<ComponentProps>(
                template,
                // @ts-ignore
                props,
              )}
            />
          ),
      )
      comp.displayName = displayName || `Stailed<${Component}>`
      return comp
    } else {
      // @ts-ignore
      const comp: FC<ComponentProps> = forwardRef(
        (props: ComponentProps, ref) => (
          // @ts-ignore
          <Component
            // @ts-ignore
            ref={ref}
            {...filterProps(props)}
            className={buildTemplateToClassName<ComponentProps>(
              template,
              props,
            )}
          />
        ),
      )
      // @ts-ignore
      comp.displayName = displayName || `Stailed<${Component.displayName}>`

      return comp
    }
  }) as CreateStailedComponent<ComponentProps, SpecificComponentProps>
}
