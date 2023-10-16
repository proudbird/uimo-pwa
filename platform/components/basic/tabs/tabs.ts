import { Component, DefineComponent } from '@/core';
import { ComponentOptions, Template } from '@/core/types';

import { specification, ITabsComponent } from './tabs.types';
import TabsItem from './tabs-item';

@DefineComponent('tabs')
export default class Tabs extends Component<ITabsComponent>(specification) {

  static scopeName = 'tabs';

  constructor({ ...rest }: ComponentOptions) {
    const stateDefinition = {
      indicator: { type: 'Element' },
      body: { type: 'Element' },
      selectedItem: { type: 'Element' },
    };

    super({ ...rest, stateDefinition });

    this.state.indicator = this.elements.indicator;
    this.state.body = this.elements.body;
    
    this.observe(this.$state.selectedItem, () => {
      if(!this.state.selectedItem) {
        this.state.indicator.style.display = `none`;
        return;
      }

      this.state.indicator.style.display = `block`;
      if(this.props.orientation === 'vertical') {
        this.state.indicator.style.top = `${this.state.selectedItem.offsetTop}px`;
        this.state.indicator.style.height = `${this.state.selectedItem.offsetHeight}px`;
      } else {
        this.state.indicator.style.left = `${this.state.selectedItem.offsetLeft}px`;
        this.state.indicator.style.width = `${this.state.selectedItem.offsetWidth}px`;
        this.state.indicator.style.top = `${this.state.selectedItem.offsetTop}px`;
      }
    })

    setTimeout(() => this.state.selectedItem = this.elements.items.firstChild as TabsItem, 0);
  }

  render(): Template {
    return {
      ...this.config,
      scope: 'tabs',
      className: {
        handler: () => `${this.config.className} ${this.props.orientation}`
      },
      children: [
        {
          tagName: 'div',
          alias: 'indicator',
          scope: 'tabs',
          className: 'indicator',
        },
        {
          tagName: 'tabs-items',
          alias: 'items',
          scope: 'tabs',
          children: this.config.children
        },
        {
          tagName: 'tabs-body',
          alias: 'body',
          scope: 'tabs',
        }
      ]
    }
  }
}
