import { ComponentDefinition } from '@/core/types';

import specification from './table-field.desc';

export { specification };

export type ExtraProps = {
  props: {
    title: string
  }
}

export interface ITableFieldComponent extends ComponentDefinition<typeof specification, ExtraProps> {};
