import { ComponentDefinition } from '@/core/types';

import specification from './taggroup.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITagGroupComponent = ComponentDefinition<typeof specification, ExtraProps>;
