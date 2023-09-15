import { ComponentDefinition } from '@/core/types';

import specification from './button.desc';

export { specification };

export type ExtraProps = { 
  props: {},
  state: {
    processing: boolean;
  }
}

export interface IButtonComponent extends ComponentDefinition<typeof specification, ExtraProps> {};
