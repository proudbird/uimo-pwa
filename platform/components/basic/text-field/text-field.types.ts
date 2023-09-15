import { ComponentDefinition } from '@/core/types';

import specification from './text-field.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITextFieldComponent = ComponentDefinition<typeof specification, {}>;
