/**
 * That file was added to make JSX work properly and pass components
 * props to JSX Elements. Passing the same types directly from
 * components 'types.ts' files doesn't work.
 */

import { ComponentDefinition } from '../core';

import { 
  BoxSpecification,
  ButtonSpecification,
  NumberFieldSpecification,
  TableFieldSpecification,
  TableFieldExtraProps,
  TableSpecification, 
  TextFieldSpecification,
  TextSpecification, 
  ViewSpecification,
} from '../components/definitions';

export type BoxComponent = ComponentDefinition<typeof BoxSpecification>;
export type ButtonComponent = ComponentDefinition<typeof ButtonSpecification>;
export type NumberFieldComponent = ComponentDefinition<typeof NumberFieldSpecification>;
export type TableComponent = ComponentDefinition<typeof TableSpecification>;
export type TableFieldComponent = ComponentDefinition<typeof TableFieldSpecification, TableFieldExtraProps>;
export type TextComponent = ComponentDefinition<typeof TextSpecification>;
export type TextFieldComponent = ComponentDefinition<typeof TextFieldSpecification>;
export type ViewComponent = ComponentDefinition<typeof ViewSpecification>;
