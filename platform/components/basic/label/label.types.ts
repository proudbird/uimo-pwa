import { ComponentDefinition } from '@/core/types';

import specification from './label.desc';

export { specification };
export interface ILabelComponent extends ComponentDefinition<typeof specification> {};
