import { Component, ComponentOptions, DefineComponent } from '@/core';
import { ChildTemplate, IComponent, IView, Template } from '@/core/types';
import { IconComponent } from '@/types/components';

import { specification, IWorkPanelComponent } from './work-panel.types';

@DefineComponent('work-panel')
export default class WorkPanel extends Component<IWorkPanelComponent>(specification) {
  
  #viewsHash: Record<string, IconComponent> = {};

  constructor({ ...rest }: ComponentOptions) {
    const stateDefinition = {
      
    };

    super({ ...rest, stateDefinition });
  }

  showView(view: IView): void {
    if(this.#viewsHash[view.id]) {
      this.elements.tabs.state.selectedItem = this.#viewsHash[view.id];
      return;
    }

    const config: ChildTemplate = {
      tagName: 'tabs-item',
      alias: 'item',
      children: [
        {
          tagName: 'box',
          alias: 'titleBox',
          className: 'title-row',
          children: [
            {
              tagName: 'label',
              alias: 'titleLabel',
              props: {
                value: view.node.props.title
              }
            },
            {
              tagName: 'icon',
              alias: 'closeButton',
              className: 'close-button',
              props: {
                variant: 'close'
              },
            },
          ]
        }
      ]
    }

    const item = this.elements.tabs.elements.items.addElement(config, {}) as IComponent;
    this.elements.tabs.elements.body.appendChild(view.node);
    this.elements.tabs.state.selectedItem = item;

    
    item.observe(this.elements.tabs.$state.selectedItem, () => {
      view.node.style.display = this.elements.tabs.state.selectedItem === item ? 'inline-block' : 'none';
    });

    const closeHandler = () => {
      this.elements.tabs.elements.items.removeChild(item);
      this.elements.tabs.elements.body.removeChild(view.node);
      this.elements.tabs.state.selectedItem = this.elements.tabs.elements.items.lastChild;
      delete this.#viewsHash[view.id];
    };

    item.elements.titleBox.elements.closeButton.on('click', closeHandler);

    this.#viewsHash[view.id] = item;
  }

  render(): Template {
    return {
      ...this.config,
      scope: 'work-panel',
      children: [
        {
          tagName: 'tabs',
          alias: 'tabs',
          props: {
            orientation: 'horizontal'
          },
        }
      ]
    }
  }
}
