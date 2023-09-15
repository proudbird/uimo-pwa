import { ComponentDefinition } from '@/core/types';

import specification from './view.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface IViewComponent extends ComponentDefinition<typeof specification, ExtraProps> {};
