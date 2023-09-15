import { ComponentDefinition } from '@/core/types';

import specification from './table-body.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface ITableBodyComponent extends ComponentDefinition<typeof specification> {};
