import { ComponentDefinition } from '@/core/types';

import specification from './modal.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IModalComponent = ComponentDefinition<typeof specification, ExtraProps>;
