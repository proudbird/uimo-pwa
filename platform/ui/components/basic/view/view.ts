import { CustomElement, DefineElement } from '@/core';

import { description, IViewComponent } from './view.types';

@DefineElement('view')
export default class View extends CustomElement<IViewComponent>(description) {}
