import { ComponentDefinition } from '@/core/types';

import specification from './table-filter-panel.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITableFilterPanelComponent = ComponentDefinition<typeof specification, ExtraProps>;
