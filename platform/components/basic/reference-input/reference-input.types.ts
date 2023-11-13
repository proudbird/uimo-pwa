import { ComponentDefinition } from '@/core/types';

import specification from './reference-input.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IReferenceInputComponent = ComponentDefinition<typeof specification, ExtraProps>;
