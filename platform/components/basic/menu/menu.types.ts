import { ComponentDefinition } from '@/core/types';

import specification from './menu.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IMenuComponent = ComponentDefinition<typeof specification, ExtraProps>;
