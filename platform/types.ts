import { DataAttribute, IDataAttributeCollection, IState, IStateManager } from "./core/data/state";

export enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export type DataAttributeValue = string | number | boolean | Date | null | undefined;

type ViewModuleMethods = Record<string, () => void>;

export type ViewModule = ViewModuleMethods & {
  onMounted?: () => void;
  onUnmounted?: () => void;
  onUpdated?: () => void;
  onBeforeUpdate?: () => void;
  onBeforeUnmount?: () => void;
  onBeforeMount?: () => void;
};

export type GetViewModuleHandler = (view: IView) => ViewModule;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type StateValueType = 'string' | 'number' | 'boolean' | 'date';

export type StringAttributeOptions = {
  initValue?: string;
  readonly maxLength?: number;
  readonly truncate?: boolean;
};

export type NumberAttributeOptions = {
  initValue?: number;
  readonly maxLength?: number;
  readonly precision?: number;
  readonly truncate?: boolean;
	readonly round?: false | 'up' | 'down';
};

export type BooleanAttributeOptions = {
  initValue?: boolean;
};

export type ReferenceAttributeValue = [string, string, string];

export type ReferenceAttributeOptions = {
  initValue?: ReferenceAttributeValue;
};

export type DateAttributeOptions = {
  initValue?: DateAttributeInitValue;
  readonly format?: DateAttributeFormat;
};

export enum DateAttributeInitValue {
  TODAY = 'today',
  START_OF_WEEK = 'startOfWeek',
  START_OF_MONTH = 'startOfMonth',
  START_OF_YEAR = 'startOfYear',
  END_OF_WEEK = 'endOfWeek',
  END_OF_MONTH = 'endOfMonth',
  END_OF_YEAR = 'endOfYear',
}

export enum DateAttributeFormat {
  DATETIME = 'datetime',
  DATE = 'date',
}

export type DataAttributeOptions = StringAttributeOptions | NumberAttributeOptions | BooleanAttributeOptions | DateAttributeOptions;

export type DataDefinition = Record<string, { type: AttributeType } & DataAttributeOptions>;

export type StateDefinition = Record<string, { 
  type: string, 
  defaultValue?: any, // TODO: remove this
  initValue?: any, // TODO: change to proper type 
  link?: any 
}>;// & DataAttributeOptions>;

export interface IDataContext {
  readonly [name: string]: DataAttribute;
}

export type ElementPropertyDataSource = {
  path: string;
  source?: string;
};

export type EventHandler = (state: IState) => any;

export type ElementPropertyHandler = {
  handler?: EventHandler;
  dependencies?: Array<DataAttribute | IDataAttributeCollection>;
};

export type ElementProp = string | number | boolean | DataAttribute | IDataAttributeCollection | ElementPropertyHandler | ElementPropertyDataSource;

// Template definition
export interface ElementDescription {
  readonly props: TemplatePropDefinition;
  readonly data?: TemplateDataDefinition;
  readonly events?: TemplateEventDefinition;
};

export interface TemplatePropDefinition {
  readonly [name: string]: {
    readonly order?: number;
    readonly title?: string;
    readonly mutable?: boolean;
    readonly responsive?: boolean;
    readonly type:  ElementPropPrimitiveType | readonly ElementPropListType[];
    readonly defaultValue?: any;
    readonly translate?: boolean;
  }
};

export type TemplateEventDefinition = Record<keyof CustomElementEvent, string>;

export interface CustomElementEvent {
  click: string;
  doubleclick: string;
  change: string;
  input: string;
  blur: string;
  focus: string;
  keydown: string;
  keyup: string;
  keypress: string;
  mousedown: string;
  mouseup: string;
  mousemove: string;
  mouseover: string;
  mouseout: string;
  mouseenter: string;
  mouseleave: string;
  touchstart: string;
  touchend: string;
  touchmove: string;
  touchcancel: string;
  dragstart: string;
  drag: string;
  dragenter: string;
  dragleave: string;
  dragover: string;
  drop: string;
  dragend: string;
  scroll: string;
  wheel: string;
  contextmenu: string;
};

export interface TemplateDataDefinition {
  readonly path: string;
  readonly scope?: 'global' | 'context' | 'state';
}; 

export type TypesMap = {
  'string': string;
  'number': number;
  'boolean': boolean;
  'date': Date;
};



export type DataSourceEventHandler = () => StateValueType;

export type ElementVarHandler = {
  handler?: () => string;
  dependencies?: Array<DataAttribute>;
};

export type ElementVar = string | DataAttribute | ElementVarHandler;

export type ElementVars = {
  [prop: string]: ElementVar | undefined;
};

export type ElementProps = {
  [prop: string]: ElementProp | undefined;
};

export type ConfigEventHandler = string | ElementEventHandler;

export type ElementEventHandler = (event: Event | MouseEvent) => void;

export type StyleProperties = keyof Omit<CSSStyleDeclaration, typeof Symbol.iterator|number|'length'|'parentRule'>;
export type StyleDefinition = {
  [property in Partial<StyleProperties>]: ElementProp | undefined;
}

export type ChildElementDefinition = ElementDefinition & { 
  tagName: string;
  id?: string;
};

export type ItemElementDefinition = ChildElementDefinition & {
  index: number;
}

export type ElementDefinition = {
  type?: 'element' | 'slot' | 'native';
  scope?: string;
  id?: string;
  alias?: string;
  className?: ElementProp;
  props?: ElementProps;
  attributes?: ElementProps;
  vars?: ElementProps;
  style?: Partial<StyleDefinition>;
  events?: Record<string, ConfigEventHandler>;
  children?: string | Array<ChildElementDefinition>;
  data?: DataAttribute | IDataAttributeCollection | ElementPropertyDataSource;
};

export type ElementPropPrimitiveType = 'string' | 'number' | 'boolean' | 'date';

export type ElementPropListType = {
  readonly value: string;
  readonly title?: string;
};

export type CustomElementProps<T extends ElementDescription> = { -readonly [K in keyof T['props']]: 
  T['props'][K]['type'] extends keyof TypesMap 
    ? TypesMap[T['props'][K]['type']]
    : T['props'][K]['type'][number] extends ElementPropListType 
      ? T['props'][K]['type'][number]['value'] 
      : null
};

export type CustomElement<T extends ElementDescription> = CustomElementProps<T> & {
  props: CustomElementProps<T>;
  data: DataAttribute | IDataAttributeCollection;
}

export type DataAttributeSetter = (value: any) => void;

export type DOMElement = HTMLElement | SVGSVGElement | CustomElement<any>;

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
  observe(observable: DataAttribute | IDataAttributeCollection, callback: EventListenerOrEventListenerObject): void;
}

export interface IView {
	elements: Record<string, ICustomElement>;
	node: ICustomElement;
	state: IState;
	showView(view: IView): void;
}


export interface Constructable<T> {
  new (...args: any[]): T;
  prototype: T;
}

export interface ConstructableCustomElement<T> {
  new (options: CustomElementOptions): T;
  prototype: T;
}

export type CustomElementOptions = {
	owner: IView;
	parent: ICustomElement;
	config: ElementDefinition;
	context?: IStateManager;
	stateDefinition?: StateDefinition;
	module?: ViewModule;
}
