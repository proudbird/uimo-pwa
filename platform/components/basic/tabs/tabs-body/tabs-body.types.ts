import { ComponentDefinition } from '@/core/types';

import specification from './tabs-body.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITabsBodyComponent = ComponentDefinition<typeof specification, ExtraProps>;
