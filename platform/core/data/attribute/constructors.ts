import StringAttribute from './string';
import NumberAttribute from './number';
import BooleanAttribute from './boolean';
import DateAttribute from './date';
import ReferenceAttribute from './reference';
import DynamicListAttribute from './dynamic-list';
import ElementAttribute from './element';

export default {
  string: StringAttribute,
  number: NumberAttribute,
  boolean: BooleanAttribute,
  date: DateAttribute,
  reference: ReferenceAttribute,
  DynamicList: DynamicListAttribute,
  Element: ElementAttribute
};
