
import { Component, DefineComponent } from '@/core';
import { IMonoDataAttribute } from '@/core/data';
import { Template } from '@/core/types';

import { specification, ITableFieldComponent } from './table-field.types';

@DefineComponent('table-field')
export default class TableField extends Component<ITableFieldComponent>(specification) {
  static scopeName = 'table';
  
  render(): Template {
		return {
			...this.config, 
			children: [
        {
          tagName: 'div',
          props: {
            innerHTML: {
              handler: () => {
                return (this.data as IMonoDataAttribute).value?.presentation || String((this.data as IMonoDataAttribute).value || '')
              },
              dependencies: [this.data],
            }
          },
        }
      ]
		};
	}
}
