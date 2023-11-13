import { ComponentDefinition } from '@/core/types';

import specification from './action-button.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IActionButtonComponent = ComponentDefinition<typeof specification, ExtraProps>;
