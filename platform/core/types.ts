import { AddElementOptions, ChildElementDefinition, CustomElementProps, ElementDefinition, ElementDescription, IView, StateDefinition, ViewModule } from "@/types";
import { DataAttribute, DataAttributeValue, IPolyDataAttribute, IState, IStateManager, StateManagerAttributes, StateValues } from "./data";

export enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export type DOMElement = HTMLElement | SVGSVGElement | ICustomElement;

export interface ICustomElement extends HTMLElement {
  isCustom: true;
  config: ElementDefinition;
  state: IState;
  $state: IStateManager;
  scope: IState;
  $scope: IStateManager;
  props: CustomElementProps<any>;
  context: IState;
  elements: Record<string, ICustomElement>;
  owner: IView;
  render(): ElementDefinition;
  observe(observable: DataAttribute | IPolyDataAttribute, callback: EventListenerOrEventListenerObject): void;
  addElement(config: ChildElementDefinition, { context }: AddElementOptions): DOMElement;
  addElements(elements: ChildElementDefinition | ChildElementDefinition[]): void;
  onDataLoad(data: IPolyDataAttribute): void;
}

export type CustomElementOptions = {
	owner: IView;
	parent: ICustomElement;
	config: ElementDefinition;
	context?: IStateManager;
	stateDefinition?: StateDefinition;
	module?: ViewModule;
}

export interface Constructable<T> {
  new (...args: any[]): T;
  prototype: T;
}

export interface ConstructableCustomElement<T> {
  new (options: CustomElementOptions): T;
  prototype: T;
}

export type ReturnClassType<D extends CustomElementDefinition<any, any>> = Constructable<ICustomElement> & ConstructableCustomElement<CustomElementType<D>>

export type CustomElementResultProps<T extends ElementDescription> = { 
	[K in keyof T['props']]: T['props'][K];
};

export type CustomElementType<T extends CustomElementDefinition<any, any>> = {
  props: CustomElementResultProps<T>;
	state: T['state'];
	$state: StateManagerAttributes<T['state']>;
  data: T['data'];
}

export type CustomElementDescription = {
	props? : Record<string, DataAttributeValue>;
	state?: StateValues;
	data?: DataAttributeValue;
};

export type CustomElementDefinition<D extends ElementDescription, C extends CustomElementDescription = {}> = {
	props: CustomElementProps<D> & C['props'];
	state: C['state'];
	data: C['data'];
};
