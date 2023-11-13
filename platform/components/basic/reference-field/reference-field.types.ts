import { ComponentDefinition } from '@/core/types';

import specification from './reference-field.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IReferenceFieldComponent = ComponentDefinition<typeof specification, ExtraProps>;
