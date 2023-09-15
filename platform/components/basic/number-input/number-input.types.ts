import { ComponentDefinition } from '@/core/types';

import specification from './number-input.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface INumberInputComponent extends ComponentDefinition<typeof specification> {};
