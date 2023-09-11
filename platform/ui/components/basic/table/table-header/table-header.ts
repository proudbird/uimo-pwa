
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table-header.desc';

const tagName = 'table-header';

@DefineElement(tagName)
export default class TableHeader extends customElement(description) {

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
