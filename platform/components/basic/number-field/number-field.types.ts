import { ComponentDefinition } from '@/core/types';

import specification from './number-field.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface INumberFieldComponent extends ComponentDefinition<typeof specification> {};
