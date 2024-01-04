import { ComponentDefinition } from '@/core/types';

import specification from './tree-view.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type ITreeViewComponent = ComponentDefinition<typeof specification, ExtraProps>;
