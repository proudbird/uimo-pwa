import { ComponentDefinition } from '@/core/types';

import specification from './box.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface IBoxComponent extends ComponentDefinition<typeof specification> {};
