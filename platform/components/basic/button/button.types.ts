import { ComponentDefinition } from '@/core/types';

import specification from './button.desc';

export { specification };
export interface IButtonComponent extends ComponentDefinition<typeof specification, {
  state: {
    processing: boolean;
  }
}> {};

