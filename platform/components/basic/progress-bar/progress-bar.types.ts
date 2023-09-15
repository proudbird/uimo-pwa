import { ComponentDefinition } from '@/core/types';

import specification from './progress-bar.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export interface IProgressBarComponent extends ComponentDefinition<typeof specification> {};
