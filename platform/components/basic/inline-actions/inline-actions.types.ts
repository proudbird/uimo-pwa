import { ComponentDefinition } from '@/core/types';

import specification from './inline-actions.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type IInlineActionsComponent = ComponentDefinition<typeof specification, ExtraProps>;
