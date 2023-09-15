import { ComponentDefinition } from '@/core/types';

import specification from './box.desc';

export { specification };
export interface IBoxComponent extends ComponentDefinition<typeof specification> {};
