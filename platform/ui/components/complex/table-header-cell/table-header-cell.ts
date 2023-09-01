
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-header-cell.desc';
import { ElementConfig } from '../../../../types';

const tagName = 'table-header-cell';

@DefineElement(tagName)
export default class TableHeaderCell extends customElement(description) {

  render(): ElementConfig {
		return {
			...this.config, 
			props: {
        innerHTML: this.config.props?.title
      },
		};
	}
}
