import { ComponentDefinition } from '@/core/types';

import specification from './text-input.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface ITextInputComponent extends ComponentDefinition<typeof specification> {};
