import { Component, DefineComponent } from '@/core';
import type { ComponentOptions, Template } from '@/core/types';

import { specification, ITagComponent } from './tag.types';

@DefineComponent('tag')
export default class Tag extends Component<ITagComponent>(specification) {

  constructor({ ...rest }: ComponentOptions) {
    super({ ... rest });

    if(this.config.props?.removable) {
      this.addElement({
        tagName: 'icon',
        className: 'remove-icon',
        props: {
          variant: 'close',
          size: 'small',
        },
        events: {
          click: () => {
            this.dispatchEvent(new CustomEvent('remove'));
          }
        }
      }, {});
    }
  }
  
  render(): Template {
    return {
      ...this.config,
      children: [
        {
          tagName: 'span',
          className: 'label',
          props: {
            innerHTML: this.config.props?.label || '',
          },
        }
      ]
    }
  }
}

