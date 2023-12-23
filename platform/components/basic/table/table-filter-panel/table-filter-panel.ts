import { Component, DefineComponent } from '@/core';
import type { ComponentOptions, Template } from '@/core/types';
import ListAttribute from '@/core/data/attribute/list';

import { specification, ITableFilterPanelComponent } from './table-filter-panel.types';

@DefineComponent('table-filter-panel')
export default class TableFilterPanel extends Component<ITableFilterPanelComponent>(specification) {

  constructor({ ...rest }: ComponentOptions) {
    super({ ... rest });

    this.data.addEventListener('change', (e: Event) => {
      this.elements.tagGroup.replaceChildren();

      (this.data as ListAttribute).forEach((filter: any) => {
        this.elements.tagGroup.addElement({
          tagName: 'tag',
          props: {
            label: `${filter.id}:&nbsp;<strong>${filter.value}</strong>`,
            removable: true,
          },
          events: {
            remove: () => {
              (this.data as ListAttribute).remove(filter);
            }
          }
        }, {});
      });
    });
  }

  render(): Template {
    return {
      ...this.config,
      className: {
        handler: () => (this.data as ListAttribute).length ? 'visible' : 'hidden',
        dependencies: [this.data],
      },
      children: [
        {
          tagName: 'field-label',
          props: {
            value: 'Filtered by:',
          }
        },
        {
          tagName: 'tag-group',
          alias: 'tagGroup',
        }
      ]
    }
  }
}

