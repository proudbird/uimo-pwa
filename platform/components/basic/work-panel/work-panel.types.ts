import { ComponentDefinition } from '@/core/types';

import specification from './work-panel.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IWorkPanelComponent = ComponentDefinition<typeof specification, ExtraProps>;
