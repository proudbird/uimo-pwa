import { ComponentDefinition } from '@/core/types';

import specification from './text-input.desc';

export { specification };
export interface ITextInputComponent extends ComponentDefinition<typeof specification> {};
