import { customElement, DefineElement } from '@/ui/core/base';
import description from './box.desc';

const tagName = 'box';

@DefineElement(tagName)
export default class Box extends customElement(description) {}
