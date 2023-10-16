import { Component, DefineComponent } from '@/core';

import { specification, IMenuItemComponent } from './menu-item.types';

@DefineComponent('menu-item')
export default class MenuItem extends Component<IMenuItemComponent>(specification) {

  static scope = 'menu';

  render() {
    return {
      ...this.config,
      children: [
        {
          tagName: 'span',
          className: 'label',
          props: {
            innerHTML: this.props.label
          }
        }
      ],
      events: {
        click: (e: Event) => {
          this.scope.selectedItem = this;
          this.config.events?.click;
          const handler = this.owner.module[this.config.events?.click as string];
						if(handler) {
							handler.call(this.owner);
            }
        }
      }
    }
  }
}

