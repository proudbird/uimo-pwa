
import { Component, DefineComponent } from '@/core';

import { specification, ITableRowComponent } from './table-row.types';

@DefineComponent('table-row')
export default class TableRow extends Component<ITableRowComponent>(specification) {}

