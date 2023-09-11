
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-row.desc';

const tagName = 'table-row';

@DefineElement(tagName)
export default class TableRow extends customElement(description) {}

