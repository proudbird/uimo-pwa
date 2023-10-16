import { ComponentDefinition } from '@/core/types';

import specification from './tabs-item.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITabsItemComponent = ComponentDefinition<typeof specification, ExtraProps>;
