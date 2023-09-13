
import { CustomElement, DefineElement } from '@/core';

import { description, ITableRowComponent } from './table-row.types';

@DefineElement('table-row')
export default class TableRow extends CustomElement<ITableRowComponent>(description) {}

