import { CustomElementDefinition } from '@/core';

import description from './view.desc';

export { description };
export interface IViewComponent extends CustomElementDefinition<typeof description> {};
