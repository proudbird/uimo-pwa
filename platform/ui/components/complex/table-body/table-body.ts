
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-body.desc';

const tagName = 'table-body';

@DefineElement(tagName)
export default class TableBody extends customElement(description) {}
