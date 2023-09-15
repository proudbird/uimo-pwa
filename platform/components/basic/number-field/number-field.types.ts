import { ComponentDefinition } from '@/core/types';

import specification from './number-field.desc';

export { specification };
export interface INumberFieldComponent extends ComponentDefinition<typeof specification> {};
