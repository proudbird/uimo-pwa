// declare enum AttributeType {
//   STRING = 'string',
//   NUMBER = 'number',
//   BOOLEAN = 'boolean',
//   DATE = 'date',
// }

declare type StateValueType = 'string' | 'number' | 'boolean' | 'date';

declare interface IDataAttributeBase  {
  readonly DataAttribute: true;
}

declare interface IDataAttribute extends EventTarget, IDataAttributeBase {
  value: any;
}

declare interface IDataAttributeIterable extends EventTarget, IDataAttributeBase {
  [Symbol.iterator];
}

declare type StringAttributeOptions = {
  initValue?: string;
  readonly maxLength?: number;
  readonly truncate?: boolean;
};

declare type NumberAttributeOptions = {
  initValue?: number;
  readonly maxLength?: number;
  readonly precision?: number;
  readonly truncate?: boolean;
	readonly round?: false | 'up' | 'down';
};

declare type BooleanAttributeOptions = {
  initValue?: boolean;
};

declare type DateAttributeOptions = {
  initValue?: DateAttributeInitValue;
  readonly format?: DateAttributeFormat;
};

declare enum DateAttributeInitValue {
  TODAY = 'today',
  START_OF_WEEK = 'startOfWeek',
  START_OF_MONTH = 'startOfMonth',
  START_OF_YEAR = 'startOfYear',
  END_OF_WEEK = 'endOfWeek',
  END_OF_MONTH = 'endOfMonth',
  END_OF_YEAR = 'endOfYear',
}

declare enum DateAttributeFormat {
  DATETIME = 'datetime',
  DATE = 'date',
}

declare type DataAttributeOptions = StringAttributeOptions | NumberAttributeOptions | BooleanAttributeOptions | DateAttributeOptions;

declare type DataDefinition = Record<string, { type: AttributeType } & DataAttributeOptions>;
declare type StateDefinition = Record<string, { type: StateValueType, link?: any } & DataAttributeOptions>;

declare interface IDataContext {
  readonly [name: string]: IDataAttribute;
}

declare type ElementPropertyDataSource = {
  path: string;
  source?: string;
};

declare type EventHandler = (state: IDataContext) => any;

declare type ElementPropertyHandler = {
  handler?: EventHandler;
  dependencies?: Array<IDataAttribute>;
};

declare type ElementProp = string | number | boolean | IDataAttribute | ElementPropertyHandler | ElementPropertyDataSource;

// Template definition
declare interface TemplateDefinition {
  readonly props: TemplatePropDefinition;
  readonly data: TemplateDataDefinition;
  readonly events?: TemplateEventDefinition;
};

declare interface TemplatePropDefinition {
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

declare type TemplateEventDefinition = Record<keyof Event, string>;

declare interface Event {
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

declare interface TemplateDataDefinition {
  readonly path: string;
  readonly scope?: 'global' | 'context' | 'state';
}; 

declare type TypesMap = {
  'string': string;
  'number': number;
  'boolean': boolean;
  'date': Date;
};

declare type ElementDefinition = {
  id?: string;
  alias?: string;
  className?: ElementProp;
  props?: ElementProps;
  attributes?: ElementProps;
  style?: Partial<StyleDefinidion>;
  events?: Record<string, ConfigEventHandler>;
  children?: string | Array<ChildElemetConfig>;
  data?: IDataAttribute | IDataAttributeIterable | ElementPropertyDataSource;
};

declare type CustomElementProps<T extends ElementDefinition> = { -readonly [K in keyof T['props']]: 
  T['props'][K]['type'] extends keyof TypesMap 
    ? TypesMap[T['props'][K]['type']]
    : T['props'][K]['type'][number] extends ElementPropListType 
      ? T['props'][K]['type'][number]['value'] 
      : null
};

declare type CustomElementArgs = [ElementConfig, ContextState?, ContextState?, ViewModule?];

declare type CustomElement<T extends ElementDefinition = { props: Record<string, any>}> = CustomElementProps<T> & {
  props: CustomElementProps<T>;
  data: IDataAttribute | IDataAttributeIterable;
}

declare type DOMElement = HTMLElement | SVGSVGElement | CustomElement<any>;