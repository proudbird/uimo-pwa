import { ComponentDefinition } from '@/core/types';

import specification from './progress-bar.desc';

export { specification };
export interface IProgressBarComponent extends ComponentDefinition<typeof specification> {};
