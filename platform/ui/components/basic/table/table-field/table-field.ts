
import { CustomElement, DefineElement } from '@/core';
import { IMonoDataAttribute } from '@/core/data';
import { ElementDefinition } from '@/types';

import { description, ITableFieldComponent } from './table-field.types';

@DefineElement('table-field')
export default class TableField extends CustomElement<ITableFieldComponent>(description) {
  render(): ElementDefinition {
		return {
			...this.config, 
			children: [
        {
          tagName: 'div',
          props: {
            innerHTML: (this.data as IMonoDataAttribute).value?.presentation
          },
        }
      ]
		};
	}
}
