import { CustomElementDefinition } from '@/core';

import description from './box.desc';

export { description };
export interface IBoxComponent extends CustomElementDefinition<typeof description> {};
