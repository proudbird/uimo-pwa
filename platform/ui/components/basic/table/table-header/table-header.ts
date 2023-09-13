
import { CustomElement, DefineElement } from '@/core';

import { description, ITableHeaderComponent } from './table-header.types';

@DefineElement('table-header')
export default class TableHeader extends CustomElement<ITableHeaderComponent>(description) {

  render() {
    return {
      ...this.config,
      className: {
				handler: () => this.scope?.resizePending ? 'resize-pending' : '',
				dependencies: [this.$scope?.resizePending]
			},
    }
  }
}
