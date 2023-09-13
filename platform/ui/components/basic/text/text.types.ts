export type TextDescription = typeof import('./text.desc').default;
import { CustomElementDefinition } from '@/core';

import description from './text.desc';

export { description };
export interface ITextComponent extends CustomElementDefinition<typeof description> {};
