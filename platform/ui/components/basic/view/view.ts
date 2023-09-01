//@ts-nocheck
import { customElement, DefineElement } from '@/ui/core/base';
import description from './view.desc';

const tagName = 'view';

@DefineElement(tagName)
export default class View extends customElement(description) {}
