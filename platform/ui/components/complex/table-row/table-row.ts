
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-row.desc';

const tagName = 'table-row';

@DefineElement(tagName)
export default class TableRow extends customElement(description) {

  constructor(...args: CustomElementArgs) {
		super(...args);
	}
  
  render() {
    return {
      ...this.config,
      events: {
        mouseenter: () => this.context!.isRowHovered!.value = true,
        mouseleave: () => this.context!.isRowHovered!.value = false,
      }
    };
  }
}
