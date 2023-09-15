import { ComponentDefinition } from '@/core/types';

import specification from './table-field.desc';

export { specification };
export interface ITableFieldComponent extends ComponentDefinition<typeof specification> {};
