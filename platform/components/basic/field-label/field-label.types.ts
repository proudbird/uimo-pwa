import { ComponentDefinition } from '@/core/types';

import specification from './field-label.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface IFieldLabelComponent extends ComponentDefinition<typeof specification> {};
