export type DataAttributeValue = string | number | boolean | Date | null | undefined;

export interface IDataAttribute extends EventTarget {
  readonly DataAttribute: true;
  isIterable: boolean;
}

export interface IDataAttributeSingle extends IDataAttribute {
  value: any;
}

export interface IDataAttributeCollection extends IDataAttribute {
  [Symbol.iterator](): Iterator<IStateManager>;
}

export type DataAttribute = IDataAttributeSingle | IDataAttributeCollection;

interface IWithDynamicProperties<T extends IDataAttribute = any> {
	[key: string]: T | any;
}

export interface IStateManager extends IWithDynamicProperties<DataAttribute> {
	getData(): IState;
	merge(source: IStateManager | IStateManager[]): IStateManager;
}

export interface IState {
  [key: string]: DataAttributeValue | any;
	addAttribute(attributeName: string, attribute: DataAttribute): void;
}
