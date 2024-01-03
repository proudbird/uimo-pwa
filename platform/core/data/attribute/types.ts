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
  inScope?: boolean;
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