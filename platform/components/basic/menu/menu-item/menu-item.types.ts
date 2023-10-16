import { ComponentDefinition } from '@/core/types';

import specification from './menu-item.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IMenuItemComponent = ComponentDefinition<typeof specification, ExtraProps>;
