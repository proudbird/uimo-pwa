import { Component, DefineComponent } from '@/core';
import Reference from '@/core/objects/reference';
import { IView } from '@/core/types';
import ListAttribute from '@/core/data/attribute/list';

import { specification, ITableRowComponent } from './table-row.types';
import TableField from '../table-field';

@DefineComponent('table-row')
export default class TableRow extends Component<ITableRowComponent>(specification) {
  render() {
    return {
      ...this.config,
      scope: 'table',
      style: { gridTemplateColumns: `var(--tableTemplate)` },
      className:{
        handler: () => this.scope.selectedItems.find((selected: Reference) => selected.id === (this.data as unknown as any).Reference?.value?.id) ? 'is-selected' : '',
        dependencies: [this.$scope.selectedItems],
      },
      events: {
        dblclick: (e: Event) => {
          const getRowFieldElement = (element: HTMLElement | null): TableField | null => {
            if(!element) return null;
            if(element instanceof TableField) {
              return element;
            } else {
              return getRowFieldElement(element.parentElement);
            }
          }
          const tableField = getRowFieldElement(e.target as HTMLElement);

          if(this.config.props?.selectionMode !== 'none') {
            if(this.owner.close) {
              this.owner.close([this.data]);
            }

            return;
          }

          if(this.config.events?.select) {
            const handler = this.owner.module[this.config.events?.select as keyof IView];
            if(handler) {
              (handler as (...args: any) => void).call(this.owner, this.data, tableField?.alias);
            }
          }
        },
        click: (e: Event) => {
          const reference = (this.data as unknown as any).Reference?.value;
          (this.scope.selectedItems as ListAttribute).set(0, reference);
        }
      }
    }
  }
}

