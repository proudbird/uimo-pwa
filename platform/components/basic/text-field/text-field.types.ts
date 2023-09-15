import { ComponentDefinition } from '@/core/types';

import specification from './text-field.desc';

export { specification };
export interface ITextFieldComponent extends ComponentDefinition<typeof specification> {};
