
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-field.desc';
import { ElementDefinition } from '@/types';
import { DataAttribute } from '@/core/data/state';

const tagName = 'table-field';

@DefineElement(tagName)
export default class TableField extends customElement(description) {
  render(): ElementDefinition {
		return {
			...this.config, 
			children: [
        {
          tagName: 'div',
          props: {
            innerHTML: (this.data as DataAttribute).value?.presentation
          },
        }
      ]
		};
	}
}
