import { CustomElementDefinition } from '@/core';

import description from './button.desc';

export { description };
export interface IButtonComponent extends CustomElementDefinition<typeof description, {
  state: {
    processing: boolean;
  }
}> {};

