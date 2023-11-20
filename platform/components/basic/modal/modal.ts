import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, IModalComponent } from './modal.types';

@DefineComponent('modal')
export default class Modal extends Component<IModalComponent>(specification) {
  render(): Template {
    return {
      ...this.config,
      style: {},
      children: [
        {
          tagName: 'box',
          alias: 'body',
          className: 'modal-box',
          children: this.config.children,
          style: {
            ...this.config.style,
          }
        }
      ],
      events: {
        mousedown: (e: Event) => {
          e.stopPropagation();

          if((e.target as HTMLElement) === this) {
            this.close();
          }
        }
      }
    }
  }

  close(): void {
    this.owner.node.remove();
  }
}

