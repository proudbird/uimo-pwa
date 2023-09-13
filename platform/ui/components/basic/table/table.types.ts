import { CustomElementDefinition } from '@/core';

import description from './table.desc';

export { description };
export interface ITableComponent extends CustomElementDefinition<typeof description> {};
