import { ComponentDefinition } from '@/core/types';

import specification from './view.desc';

export { specification };
export interface IViewComponent extends ComponentDefinition<typeof specification> {};
