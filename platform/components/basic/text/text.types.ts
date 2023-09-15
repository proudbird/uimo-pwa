export type TextDescription = typeof import('./text.desc').default;
import { ComponentDefinition } from '@/core/types';

import specification from './text.desc';

export { specification };
export interface ITextComponent extends ComponentDefinition<typeof specification, {
  data: string;
}> {};
