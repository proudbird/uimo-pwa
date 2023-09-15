
import { Component, DefineComponent } from '@/core';

import { specification, ITableBodyComponent } from './table-body.types';

@DefineComponent('table-body')
export default class TableBody extends Component<ITableBodyComponent>(specification) {}
