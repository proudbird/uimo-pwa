import { ComponentDefinition } from '@/core/types';

import specification from './table-header.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface ITableHeaderComponent extends ComponentDefinition<typeof specification> {};
