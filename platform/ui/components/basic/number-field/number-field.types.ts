import { CustomElementDefinition } from '@/core';

import description from './number-field.desc';

export { description };
export interface INumberFieldComponent extends CustomElementDefinition<typeof description> {};
