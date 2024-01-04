import { ComponentDefinition } from '@/core/types';

import specification from './tree-view-item.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITreeViewItemComponent = ComponentDefinition<typeof specification, ExtraProps>;
