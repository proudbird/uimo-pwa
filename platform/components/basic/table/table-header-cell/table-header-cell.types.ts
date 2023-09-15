import { ComponentDefinition } from '@/core/types';

import specification from './table-header-cell.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface ITableHeaderCellComponent extends ComponentDefinition<typeof specification> {};
