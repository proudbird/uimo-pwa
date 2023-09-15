import { componentFabric, DefineComponent } from './component';
import { ComponentDefinition, ComponentOptions, ComponentSpecification, ExtendedComponent } from './types';

export const Component = componentFabric as (
  <D extends ComponentDefinition<any, any>>(definition: ComponentSpecification) => ExtendedComponent<D>
);

export { DefineComponent };
export type { 
  ComponentDefinition, 
  ComponentOptions 
};
