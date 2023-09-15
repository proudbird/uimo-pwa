import StringAttribute from './attribute/string';
import NumberAttribute from './attribute/number';
import BooleanAttribute from './attribute/boolean';
import DateAttribute from './attribute/date';
import ReferenceAttribute, { Reference } from './attribute/reference';
import DynamicListAttribute, { DynamicList } from './attribute/dynamic-list';

export {
  StringAttribute,
  NumberAttribute,
  BooleanAttribute,
  DateAttribute, ReferenceAttribute,
  DynamicListAttribute
};

export type { Reference, DynamicList };

export type DataAttributeValue = string | number | boolean | Date | Reference | DynamicList;

export interface IDataAttribute extends EventTarget {
  readonly DataAttribute: true;
  isIterable: boolean;
}

export interface IMonoDataAttribute extends IDataAttribute {
  value: any;
}

export interface IPolyDataAttribute extends IDataAttribute {
  [Symbol.iterator](): Iterator<IStateManager>;
  page: number;
  limit: number;
  forEach(iteratee: (value: IStateManager, index: number) => boolean | void): void;
  getItemByIndex(index: number): IStateManager;
	getItemByPage(page: number, index: number): IStateManager;
  nextPage(): void;
}

export type DataAttribute = IMonoDataAttribute | IPolyDataAttribute;

export type DataAttributeMap<T> =
	T extends string ? StringAttribute :
	T extends number ? NumberAttribute :
	T extends boolean ? BooleanAttribute :
	T extends Date ? DateAttribute :
	T extends Reference ? ReferenceAttribute :
	T extends DynamicList ? DynamicListAttribute :
	DataAttribute;

  type WithDynamicProperties = {
    [key: string]: IDataAttribute | any;
  }
  
  export interface IStateManager extends WithDynamicProperties {
    getData(): IState;
    merge(source: IStateManager | IStateManager[]): IStateManager;
  }
  
  export interface IState {
    [key: string]: DataAttributeValue | any;
    addAttribute(attributeName: string, attribute: DataAttribute): void;
  }
  
  export type StateValues = Record<string, DataAttributeValue>;

  export type StateManagerAttributes<T extends StateValues = any> = {
    [property in keyof T]: DataAttributeMap<T[property]>;
  }
  
  export type StateDefinition = Record<string, { 
    type: string, 
    defaultValue?: any, // TODO: we need to leave only one of these
    initValue?: any,  
    link?: any 
  }>;

  export type DataAttributeSetter = (value: any) => void;