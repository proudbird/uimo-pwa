declare enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

declare interface IDataAttributeBase  {
  readonly DataAttribute: true;
}

declare interface IDataAttribute extends EventTarget, IDataAttributeBase {
  value: any;
}

declare type StringAttributeOptions = {
  readonly initValue?: string;
  readonly maxLength?: number;
  readonly truncate?: boolean;
};

declare type NumberAttributeOptions = {
  readonly initValue?: number;
  readonly maxLength?: number;
  readonly precision?: number;
  readonly truncate?: boolean;
	readonly round?: false | 'up' | 'down';
};

declare type BooleanAttributeOptions = {
  readonly initValue?: boolean;
};

declare type DateAttributeOptions = {
  readonly initValue?: DateAttributeInitValue;
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

declare interface IDataContext {
  readonly [name: string]: IDataAttribute;
}

declare type ElementPropertyDataSource = {
  dataPath: string;
  source?: string;
};

declare type EventHandler = (state: IDataContext) => any;

declare type ElementPropertyHandler = {
  handler?: EventHandler;
  dependencies?: Array<IDataAttribute>;
};

declare type ElementProp = string | number | boolean | IDataAttribute | ElementPropertyHandler | ElementPropertyDataSource;