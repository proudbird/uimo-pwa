import { ComponentDefinition } from '@/core/types';

import specification from './label.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface ILabelComponent extends ComponentDefinition<typeof specification> {};
