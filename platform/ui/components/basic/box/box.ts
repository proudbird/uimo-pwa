import { CustomElement, DefineElement } from '@/core';

import { description, IBoxComponent } from './box.types';

@DefineElement('box')
export default class Box extends CustomElement<IBoxComponent>(description) {}
