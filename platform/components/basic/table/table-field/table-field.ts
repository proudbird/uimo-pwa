
import { Component, DefineComponent } from '@/core';
import { IMonoDataAttribute } from '@/core/data';
import { Template } from '@/core/types';

import { specification, ITableFieldComponent } from './table-field.types';

@DefineComponent('table-field')
export default class TableField extends Component<ITableFieldComponent>(specification) {
  render(): Template {
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
