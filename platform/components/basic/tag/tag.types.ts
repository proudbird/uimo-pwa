import { ComponentDefinition } from '@/core/types';

import specification from './tag.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITagComponent = ComponentDefinition<typeof specification, ExtraProps>;
