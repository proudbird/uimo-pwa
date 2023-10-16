import { ComponentDefinition } from '@/core/types';

import specification from './icon.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IIconComponent = ComponentDefinition<typeof specification, ExtraProps>;
