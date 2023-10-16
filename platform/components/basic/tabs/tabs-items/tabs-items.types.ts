import { ComponentDefinition } from '@/core/types';

import specification from './tabs-items.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITabsItemsComponent = ComponentDefinition<typeof specification, ExtraProps>;
