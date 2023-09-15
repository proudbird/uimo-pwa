import { ComponentDefinition } from '@/core/types';

import specification from './table-row.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface ITableRowComponent extends ComponentDefinition<typeof specification> {};
