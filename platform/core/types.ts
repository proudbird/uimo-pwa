import { ElementEvents } from "../types/dom";
import { DataAttribute, DataAttributeValue, IPolyDataAttribute, IPolyDataAttributeEvent, IState, IStateManager, StateDefinition, StateManagerAttributes, StateValues } from "./data";
import InstanceAttribute from "./data/attribute/instance";
import Reference from "./objects/reference";

/**
 * Common Types
 */
export type WithDynamicProperties<T = any> = {
  [key: string]: T;
}

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
  // readonly events?: EventsSpecification;
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

export type EventHandler<E extends Event = Event> = (event: E, ...args: any) => void;
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
  modal?: boolean;
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

export interface IComponent<D extends DataAttribute = DataAttribute> extends HTMLElement {
  isCustom: true;
  config: Template;
  state: IState;
  $state: IStateManager;
  scope: IState;
  $scope: IStateManager;
  props: ComponentProps<any>;
  context: IState;
  data: D;
  alias: string | undefined;
  elements: Record<string, IComponent>;
  owner: IView;
  master: IComponent | null;
  render(): Template;
  observe(observable: DataAttribute | IPolyDataAttribute, callback: EventListenerOrEventListenerObject): void;
  on(event: string, callback: EventListener | string): void;
  addElement(config: ChildTemplate, options?: ElementOptions): DOMElement;
  addElements(elements: ChildTemplate | ChildTemplate[]): void;
  onDataLoad(data: IPolyDataAttribute): void;
  onDataChanged(event: IPolyDataAttributeEvent): void;
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

export type ExtendedComponent<T extends ComponentDefinition<any, any>, D extends DataAttribute = DataAttribute> = Constructable<IComponent<D>> & ConstructableComponent<IExtendedComponent<T>>

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
  events?: string[];
};

export type ComponentDefinition<D extends ComponentSpecification, C extends ComponentDescription = {}> = {
	props: ComponentProps<D> & C['props'];
	state?: C['state'];
	data?: C['data'];
  events?: C['events'];
};

export type ComponentPropsFromDefinition<T extends ComponentDefinition<any>> = {
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

export type ViewParams = WithDynamicProperties & {
  reference?: Reference;
  selectedItems?: Reference[];
};

export type ViewCloseCallback = (result: any) => void;

export interface IView extends EventTarget {
  id: string;
	elements: Record<string, IComponent>;
	node: IComponent;
	state: IState;
	module: ViewModule;
  reference: Reference | null;
  instance: InstanceAttribute | null;
  params: ViewParams;
  parent: IView | null
  on(event: string, callback: EventListenerOrEventListenerObject): void;
	show(view: IView, closeCallback: ViewCloseCallback): void;
  close: ViewCloseCallback
}

export type InitViewModuleCallback = (view: IView) => ViewModule;
