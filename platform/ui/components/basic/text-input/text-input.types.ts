import { CustomElementDefinition } from '@/core';

import description from './text-input.desc';

export { description };
export interface ITextInputComponent extends CustomElementDefinition<typeof description> {};
