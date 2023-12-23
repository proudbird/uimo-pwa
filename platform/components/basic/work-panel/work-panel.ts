import { Component, type ComponentOptions, DefineComponent } from '@/core';
import { ChildTemplate, IComponent, IView, Template } from '@/core/types';
import { IconComponent } from '@/types/components';

import { specification, IWorkPanelComponent } from './work-panel.types';

@DefineComponent('work-panel')
export default class WorkPanel extends Component<IWorkPanelComponent>(specification) {
  
  #viewsHash: Record<string, { element: HTMLElement, view: IView }> = {};

  constructor({ ...rest }: ComponentOptions) {
    const stateDefinition = {
      
    };

    super({ ...rest, stateDefinition });
  }

  show(view: IView): void {
    let viewId = view.id;
    if(view.reference) {
      viewId = `${viewId}#${view.reference.id}`;
    }

    if(this.#viewsHash[viewId]) {
      this.elements.tabs.state.selectedItem = this.#viewsHash[viewId].element;
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
      view.node.style.display = this.elements.tabs.state.selectedItem === item ? 'flex' : 'none';
    });

    const closeHandler = () => {
      this.elements.tabs.elements.items.removeChild(item);
      this.elements.tabs.elements.body.removeChild(view.node);
      this.elements.tabs.state.selectedItem = this.elements.tabs.elements.items.lastChild;
      delete this.#viewsHash[viewId];

      const currentView = Object.entries(this.#viewsHash).find(([key, value]) => value.element === this.elements.tabs.state.selectedItem)?.[1].view;

      const url = new URL(location.href);
      url.searchParams.delete('view');
      url.searchParams.delete('key');

      if(currentView) {
        url.searchParams.set('view', currentView.id);

        if(currentView.reference) {
          url.searchParams.set('key', currentView.reference.id);
        }
      }

      history.replaceState({}, '', url.toString());
    };

    item.elements.titleBox.elements.closeButton.on('click', closeHandler);

    this.#viewsHash[viewId] = { element: item, view };

    view.on('close', () => {
      setTimeout(closeHandler, 100);
    });
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
