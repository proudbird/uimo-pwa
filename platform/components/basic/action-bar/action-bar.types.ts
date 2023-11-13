import { ComponentDefinition } from '@/core/types';

import specification from './action-bar.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IActionBarComponent = ComponentDefinition<typeof specification, ExtraProps>;
