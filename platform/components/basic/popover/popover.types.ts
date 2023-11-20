import { ComponentDefinition } from '@/core/types';

import specification from './popover.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IPopoverComponent = ComponentDefinition<typeof specification, ExtraProps>;
