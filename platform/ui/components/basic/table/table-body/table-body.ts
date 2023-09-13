
import { CustomElement, DefineElement } from '@/core';

import { description, ITableBodyComponent } from './table-body.types';

@DefineElement('table-body')
export default class TableBody extends CustomElement<ITableBodyComponent>(description) {}
