import { ElementEvents } from "../types/dom";
import { DataAttribute, DataAttributeValue, IPolyDataAttribute, IState, IStateManager, StateDefinition, StateManagerAttributes, StateValues } from "./data";

/**
 * Component Specification
 */
export type PropMonoType = 'string' | 'number' | 'boolean' | 'date';

export type PropListType = {
  readonly value: string;
  readonly title?: string;
};

export interface PropsSpecification {
  readonly [name: string]: {
    readonly order?: number;
    readonly title?: string;
    readonly mutable?: boolean;
    readonly responsive?: boolean;
    readonly type: PropMonoType | readonly PropListType[];
    readonly defaultValue?: any;
    readonly translate?: boolean;
  }
};

export type EventsSpecification = Record<keyof ElementEvents, string>;

export interface DataSpecification {
  readonly type: string;
}; 

export interface ComponentSpecification {
  readonly props: PropsSpecification;
  readonly data?: DataSpecification;
  readonly events?: EventsSpecification;
};

/**
 * Component Template Definition
 */
export type ElementType = 'element' | 'slot' | 'native';

export type PropHandler = () => any;
export type PropHandlerDefinition = {
  handler?: PropHandler;
  dependencies?: Array<DataAttribute | string>;
};

export type DataSourceType = 'state' | 'scope' | 'global';
export type PropDataSourceDefinition = {
  path: string;
  source?: DataSourceType;
};

export type PropDefinition = string | number | boolean | DataAttribute | PropHandlerDefinition | PropDataSourceDefinition;
export type PropDefinitions = Record<string, PropDefinition>;

export type EventHandler<E extends Event = Event> = (event: E) => void;
export type EventHandlerDefinition<E extends Event = Event> = string | EventHandler<E>;

export type StyleProperties = keyof Omit<CSSStyleDeclaration, typeof Symbol.iterator | number | 'length' | 'parentRule'>;
export type StyleDefinition = {
  [property in Partial<StyleProperties>]?: PropDefinition;
};

export type MonoChildTemplate = Template & { 
  tagName: string;
};
export type PolyChildTemplate = MonoChildTemplate & {
  index: number;
}
export type ChildTemplate = MonoChildTemplate | PolyChildTemplate;

export type Template = {
  type?: ElementType;
  scope?: string;
  id?: string;
  alias?: string;
  className?: PropDefinition;
  attributes?: PropDefinitions;
  style?: Partial<StyleDefinition>;
  events?: Record<string, EventHandlerDefinition>;
  children?: string | Array<ChildTemplate>;
  props?: PropDefinitions;
  data?: DataAttribute | PropDataSourceDefinition;
};


// Custom Element
export type TypesMap = {
  'string': string;
  'number': number;
  'boolean': boolean;
  'date': Date;
};

export type ComponentProps<T extends ComponentSpecification> = { -readonly [K in keyof T['props']]: 
  T['props'][K]['type'] extends keyof TypesMap 
    ? TypesMap[T['props'][K]['type']]
    : T['props'][K]['type'][number] extends PropListType 
      ? T['props'][K]['type'][number]['value'] 
      : null
};

export type Component<T extends ComponentSpecification> = ComponentProps<T> & {
  props: ComponentProps<T>;
  data: DataAttribute;
}

export type DOMElement = HTMLElement | SVGSVGElement | IComponent;

export type ElementOptions = {
	context?: IStateManager;
  position?: number;
}

export interface IComponent extends HTMLElement {
  isCustom: true;
  config: Template;
  state: IState;
  $state: IStateManager;
  scope: IState;
  $scope: IStateManager;
  props: ComponentProps<any>;
  context: IState;
  elements: Record<string, IComponent>;
  owner: IView;
  render(): Template;
  observe(observable: DataAttribute | IPolyDataAttribute, callback: EventListenerOrEventListenerObject): void;
  addElement(config: ChildTemplate, options: ElementOptions): DOMElement;
  addElements(elements: ChildTemplate | ChildTemplate[]): void;
  onDataLoad(data: IPolyDataAttribute): void;
}

export type ComponentOptions = {
	owner: IView;
	parent: IComponent;
	config: Template;
	context?: IStateManager;
	stateDefinition?: StateDefinition;
	module?: ViewModule;
}

export interface Constructable<T> {
  new (...args: any[]): T;
  prototype: T;
}

export interface ConstructableComponent<T> {
  new (options: ComponentOptions): T;
  prototype: T;
}

export type ExtendedComponent<D extends ComponentDefinition<any, any>> = Constructable<IComponent> & ConstructableComponent<IExtendedComponent<D>>

export type ExtendedComponentProps<T extends ComponentSpecification> = { 
	[K in keyof T['props']]: T['props'][K];
};

export interface IExtendedComponent<T extends ComponentDefinition<any, any>> {
  props: ExtendedComponentProps<T>;
	state: T['state'];
	$state: StateManagerAttributes<T['state']>;
  data: T['data'];
}

export type ComponentDescription = {
	props? : Record<string, DataAttributeValue>;
	state?: StateValues;
	data?: DataAttributeValue;
};

export type ComponentDefinition<D extends ComponentSpecification = { props: {} }, C extends ComponentDescription = {}> = {
	props: ComponentProps<D> & C['props'];
	state: C['state'];
	data: C['data'];
};

export type ComponentPropsFromDefinition<T extends ComponentDefinition> = {
  [K in keyof T['props']]?: T['props'][K];
}

/**
 * View Definition
 */
type ViewModuleMethods = Record<string, () => void>;

export type ViewModule = ViewModuleMethods & {
  onMounted?: () => void;
  onUnmounted?: () => void;
  onUpdated?: () => void;
  onBeforeUpdate?: () => void;
  onBeforeUnmount?: () => void;
  onBeforeMount?: () => void;
};

export interface IView {
	elements: Record<string, IComponent>;
	node: IComponent;
	state: IState;
	showView(view: IView): void;
}

export type InitViewModuleCallback = (view: IView) => ViewModule;
