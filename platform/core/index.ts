import { componentFabric, DefineComponent } from './component';
import { DataAttribute } from './data';
import { ComponentDefinition, ComponentOptions, ComponentSpecification, ExtendedComponent } from './types';

export const Component = componentFabric as (
  <T extends ComponentDefinition<any, any>, D extends DataAttribute = DataAttribute>(definition: ComponentSpecification) => ExtendedComponent<T, D>
);

export { DefineComponent };
export type { 
  ComponentDefinition, 
  ComponentOptions 
};
