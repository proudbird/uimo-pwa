import StringAttribute from './attribute/string';
import NumberAttribute from './attribute/number';
import BooleanAttribute from './attribute/boolean';
import DateAttribute from './attribute/date';
import ReferenceAttribute from './attribute/reference';
import DynamicListAttribute, { DynamicList } from './attribute/dynamic-list';
import Reference from '../objects/reference';
import { StructureAttributeType } from './attribute/structure';

export {
  StringAttribute,
  NumberAttribute,
  BooleanAttribute,
  DateAttribute, ReferenceAttribute,
  DynamicListAttribute
};

export type { DynamicList };

export type DataAttributeValue = string | number | boolean | Date | Reference | DynamicList;

export interface IDataAttribute extends EventTarget {
  readonly DataAttribute: true;
  isIterable: boolean;
}

export interface IMonoDataAttribute extends IDataAttribute {
  value: any;
}

export interface IPolyDataAttribute extends IDataAttribute {
  [Symbol.iterator](): Iterator<any>;
  // page: number;
  // limit: number;
  length: number;
  // selected: string | undefined;
  // direction: 'next' | 'prev' | undefined
  forEach(iteratee: (value: any, index: number) => boolean | void): void;
  // getItemByIndex(index: number): IStateManager;
	// getItemByPage(page: number, index: number): IStateManager;
  // nextPage(): void;
  // prevPage(): void;
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
  link?: any,
  id?: string,
  selected?: string,
}>;

export type DataAttributeSetter = (value: any) => void;

export type PolyDataAttributeChangeEventType = 'add' | 'remove' | 'sort';

export type PolyDataAttributeChangeOptions<T> = {
	initiator: DataAttribute;
	collection: any;
  item: any;
	event: PolyDataAttributeChangeEventType;
};

export interface IPolyDataAttributeEvent {
  initiator: DataAttribute;
  collection: any;
  item: any;
  event: PolyDataAttributeChangeEventType;
}