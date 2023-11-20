
import { Component, DefineComponent } from '@/core';

import { specification, ITableHeaderComponent } from './table-header.types';

@DefineComponent('table-header')
export default class TableHeader extends Component<ITableHeaderComponent>(specification) {
  static scopeName = 'table';
  
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
