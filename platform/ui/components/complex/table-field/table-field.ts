
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-field.desc';
import { ElementConfig } from '../../../../types';

const tagName = 'table-field';

@DefineElement(tagName)
export default class TableField extends customElement(description) {
  render(): ElementConfig {
		return {
			...this.config, 
      className: { 
        handler: () => this.context?.isRowHovered?.value ? 'hovered' : '', 
        dependencies: [this.context?.isRowHovered]
      },
			children: [
        {
          tagName: 'div',
          props: {
            innerHTML: { handler: () => (this.data as IDataAttribute).value?.presentation }
          },
        }
      ]
		};
	}
}
