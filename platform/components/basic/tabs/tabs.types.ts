import { ComponentDefinition } from '@/core/types';

import specification from './tabs.desc';
import TabsItem from './tabs-item/tabs-item';
import TabsBody from './tabs-body/tabs-body';

export { specification };

export type ExtraProps = { 
  props: {},
  state: {
    indicator: HTMLElement,
    body: TabsBody,
    selectedItem: TabsItem
  },
};

export type ITabsComponent = ComponentDefinition<typeof specification, ExtraProps>;
