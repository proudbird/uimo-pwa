import UnknownAttribute from './unknown';
import StringAttribute from './string';
import NumberAttribute from './number';
import BooleanAttribute from './boolean';
import DateAttribute from './date';
import StructureAttribute from './structure';
import ListAttribute from './list';
import ReferenceAttribute from './reference';
import InstanceAttribute from './instance';
import DynamicListAttribute from './dynamic-list';
import ElementAttribute from './element';
import VariableAttribute from './variable';

export default {
  unknown: UnknownAttribute,
  string: StringAttribute,
  number: NumberAttribute,
  boolean: BooleanAttribute,
  date: DateAttribute,
  structure: StructureAttribute,
  list: ListAttribute,
  reference: ReferenceAttribute,
  Instance: InstanceAttribute,
  DynamicList: DynamicListAttribute,
  Element: ElementAttribute,
  variable: VariableAttribute
};
