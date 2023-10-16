import { Component, DefineComponent } from '@/core';

import { specification, ITabsItemComponent } from './tabs-item.types';
import { ChildTemplate } from '@/core/types';


@DefineComponent('tabs-item')
export default class TabsItem extends Component<ITabsItemComponent>(specification) {

  static scopeName = 'tabs';

  connectedCallback() {
    const bodyConfig = (this.config.children as ChildTemplate[])?.
      find((slot) => slot.tagName === 'body');

    if (bodyConfig) {
      (bodyConfig.children as ChildTemplate[]).forEach(child => {
        child.style = child.style || {};
        child.style.display = {
          handler: () => this.scope.selectedItem === this ? 'inline-block' : 'none',
          dependencies: [this.$scope.selectedItem]
        };
      });
      this.scope.body.addElements(bodyConfig.children);
    }
  }

  render() {
    const template =  {
      ...this.config,
      scope: 'tabs',
      className: {
        handler: () => this.scope.selectedItem === this ? 'is-selected' : '',
        dependencies: [this.$scope.selectedItem]
      },
      events: {
        click: () => this.scope.selectedItem = this
      }
    }

    if(this.props?.label) {
      template.children =  [
        {
          tagName: 'span',
          className: 'label',
          props: {
            innerHTML: this.props.label
          }
        }
      ];
    } else {
      template.children = (this.config.children as ChildTemplate[]).filter((slot) => slot.tagName !== 'body');
    }

    return template;
  }
}

