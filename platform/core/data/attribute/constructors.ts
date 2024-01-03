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
import TreeAttribute from './tree';
import ElementAttribute from './element';
import VariableAttribute from './variable';

export default {
  string: StringAttribute,
  number: NumberAttribute,
  boolean: BooleanAttribute,
  Date: DateAttribute,
  Structure: StructureAttribute,
  List: ListAttribute,
  Reference: ReferenceAttribute,
  Instance: InstanceAttribute,
  DynamicList: DynamicListAttribute,
  Tree: TreeAttribute,
  Element: ElementAttribute,
  Variable: VariableAttribute
};
