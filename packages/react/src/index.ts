import stail from './stail.js'
import type {
  BaseCreateStailed,
  CreateStailed,
  PropsOf,
  StailedOptions,
  StyledTags,
} from './stail.js'
import createStailedComponent from './createStailedComponent.js'
import type { CreateStailedComponent } from './createStailedComponent.js'

import makeRender from './utils/makeRender.js'
import type { SpecificStailProps } from './utils/makeRender.js'
import type { DecoratedComponent } from './utils/symbols.js'
import {
  StailComponent,
  StailFilter,
  StailTemplate,
  decorate,
  isStailComponent,
} from './utils/symbols.js'

export default stail

export { createStailedComponent }

export type {
  BaseCreateStailed,
  CreateStailed,
  CreateStailedComponent,
  PropsOf,
  StailedOptions,
  StyledTags,
  makeRender,
  SpecificStailProps,
  DecoratedComponent,
  StailComponent,
  StailFilter,
  StailTemplate,
  decorate,
  isStailComponent,
}
