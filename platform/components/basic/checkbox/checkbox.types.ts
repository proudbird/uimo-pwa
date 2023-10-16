import { ComponentDefinition } from '@/core/types';

import specification from './checkbox.desc';

export { specification };

export type ExtraProps = { 
  props: {},
  data: boolean
};

export type ICheckboxComponent = ComponentDefinition<typeof specification, {}>;
