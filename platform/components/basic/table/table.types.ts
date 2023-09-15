import { ComponentDefinition } from '@/core/types';

import specification from './table.desc';

export { specification };
export interface ITableComponent extends ComponentDefinition<typeof specification> {};
