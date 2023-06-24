export type DataAttributeValue = boolean | string | number | Date | undefined;

export type EventHandler<T extends DataAttributeValue> = (value: T) => void;

export type BuildInTags = 'div' | 'span' | 'label';
export type CustomElementTags = 'uimo-field';

export type TagName = BuildInTags & CustomElementTags;

export type ConfigEventHandler = string | ElementEventHandler;


export type TemplateElementState = Record<string, IDataAttribute>;

export type TemplatePropertyDataHandler<T extends TemplateElementState> = (state: T) => DataAttributeValue;

export type TemplatePropertyDataSource<T extends TemplateElementState> = {
  dataPath?: string;
  handler?: TemplatePropertyDataHandler<T>;
  dependencies?: Array<string>;
};

export type TemplatePropertyValue<T extends TemplateElementState> = DataAttributeValue | TemplatePropertyDataSource<T>;

export type Template<T extends TemplateElementState, P extends BaseElementProps> = {
  tagName: string;
  id?: string;
  alias?: string;
  events?: Record<string, ConfigEventHandler>;
  props?: TemplateProps<T, P>;
  children?: Array<Template<T, P>> | TemplatePropertyDataSource<T>;
};

export type TemplateElementProperty<T extends TemplateElementState, P> = {
  [property in keyof P]: TemplatePropertyDataSource<T>;
}

export type TemplateProps<T extends TemplateElementState, P extends BaseElementProps> = 
  Partial<CSSStyleDeclaration> & 
  TemplateElementProperty<T, P> & {
    className?: string;
  };

export type BaseElementProps = {
  alias?: string;
  className?: string;
};

export type DataSourceEventHandler = (state: ContextState) => DataAttributeValue;

export type ElementPropertyHandler = {
  handler?: DataSourceEventHandler;
  dependencies?: Array<IDataAttribute>;
};

export type ElementPropertyDataSource = {
  dataPath: string;
  source: string;
};

export type ElementProp = string | number | boolean | IDataAttribute | ElementPropertyHandler | ElementPropertyDataSource;

export type ElementProps = {
  [prop: string]: ElementProp;
};

export type ChildElemetConfig = ElementConfig & { 
  tagName: string;
  id?: string;
};

export type ElementConfig = {
  alias?: string;
  className?: ElementProp;
  props?: ElementProps;
  attributes?: ElementProps;
  style?: Partial<StyleDefinidion>;
  events?: Record<string, ConfigEventHandler>;
  children?: string | Array<ChildElemetConfig>;
};

export type ViewTemplate = ElementConfig & ChildElemetConfig;

export type ElementState = {
  [attribute: string]: IDataAttribute;
};

export type ViewModule = Record<string, Function>;

export type ContextState = ElementState;

export type Context<S extends ElementState> = {
  state?: S;
}

export type ElementPresets = {
  tagName: string;
  className: string
}

export type DataAttributeEventHandler = (value: DataAttributeValue) => void;

export interface IDataAttribute extends EventTarget {
  value: DataAttributeValue;
}

export type ElementTemplate = ElementConfig & {
  tagName: string;
};

export type StyleProperties = keyof Omit<CSSStyleDeclaration, typeof Symbol.iterator|number|'length'|'parentRule'>;
export type StyleDefinidion = {
  [propery in Partial<StyleProperties>]: string | IDataAttribute | ElementPropertyHandler;
}

export type DOMElement = HTMLElement | SVGSVGElement | CustomElement<any>;

export type ElementEventHandler = (event: Event) => void;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type ElementDefinition = {
  readonly props: ElementPropDefinition;
  readonly events?: any;
};

export type ElementPropDefinition = {
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

export type ElementPropPrimitiveType = 'string' | 'number' | 'boolean' | ' date';

export type ElementPropListType = {
  readonly value: string;
  readonly title?: string;
  // readonly default?: true;
};

export type TypesMap = {
  'string': string;
  'number': number;
  'boolean': boolean;
  'date': Date;
};

export type CustomElementProps<T extends ElementDefinition> = { -readonly [K in keyof T['props']]: 
  T['props'][K]['type'] extends keyof TypesMap 
    ? TypesMap[T['props'][K]['type']]
    : T['props'][K]['type'][number] extends ElementPropListType 
      ? T['props'][K]['type'][number]['value'] 
      : null
};

export type CustomElementArgs = [ElementConfig, ContextState?];

export type CustomElement<T extends ElementDefinition = { props: Record<string, any>}> = {
  props: CustomElementProps<T>;
}