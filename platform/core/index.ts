import { componentFabric, DefineComponent } from './component';
import { DataAttribute } from './data';
import { ComponentDefinition, ComponentOptions, ComponentSpecification, ExtendedComponent } from './types';

const Component = componentFabric as (
  <T extends ComponentDefinition<any, any>, D extends DataAttribute = DataAttribute>(definition: ComponentSpecification) => ExtendedComponent<T, D>
);

export { Component, DefineComponent };
export type { 
  ComponentDefinition, 
  ComponentOptions 
};
