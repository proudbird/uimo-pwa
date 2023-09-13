import { CustomElementDefinition } from '@/core';

import description from './label.desc';

export { description };
export interface ILabelComponent extends CustomElementDefinition<typeof description> {};
