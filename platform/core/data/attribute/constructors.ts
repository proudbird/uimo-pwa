import UnknownAttribute from './unknown';
import StringAttribute from './string';
import NumberAttribute from './number';
import BooleanAttribute from './boolean';
import DateAttribute from './date';
import ListAttribute from './list';
import ReferenceAttribute from './reference';
import InstanceAttribute from './instance';
import DynamicListAttribute from './dynamic-list';
import ElementAttribute from './element';

export default {
  unknown: UnknownAttribute,
  string: StringAttribute,
  number: NumberAttribute,
  boolean: BooleanAttribute,
  date: DateAttribute,
  list: ListAttribute,
  reference: ReferenceAttribute,
  Instance: InstanceAttribute,
  DynamicList: DynamicListAttribute,
  Element: ElementAttribute
};
