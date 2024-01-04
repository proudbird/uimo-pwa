import { Component, DefineComponent } from '@/core';
import type { ChildTemplate, ComponentOptions, EventHandler, IComponent, Template } from '@/core/types';
import { IMonoDataAttribute } from '@/core/data';
import { TreeItemAttribute } from '@/core/data/attribute/tree';

import { specification, ITreeViewItemComponent } from './tree-view-item.types';
import { executeMethod } from '@/core/fabric';

@DefineComponent('tree-view-item')
export default class TreeViewItem extends Component<ITreeViewItemComponent>(specification) {

  constructor({ config, stateDefinition, owner, ...rest }: ComponentOptions) {
    config = config || {};
    config.scope = 'tree-view';

    stateDefinition = {
      expanded: { type: 'boolean', initValue: false, inScope: false },
    };

    super({ config, stateDefinition, owner, ...rest });
  }

  render(): Template {
		return {
			...this.config,
      children: [
        {
          tagName: 'box',
          alias: 'node',
          scope: 'tree-view',
          className: {
            handler: () => {
              return `node ${this.scope.selected === this ? 'selected' : ''}`;
            },
            dependencies: [this.$scope.selected]
          },
          style: {
            paddingInlineStart: {
              handler: () => {
                return `${(this.data as TreeItemAttribute)?.level * 20}px`;
              },
              dependencies: [this.data]
            }
          },
          children: [
            {
              tagName: 'div',
              className: 'icons-container',
              children: [
                (this.data as TreeItemAttribute).isBranchNode 
                  ? {
                    tagName: 'icon',
                    className: {
                      handler: () => {
                        return `arrow ${this.state.expanded ? 'expanded' : ''}`;
                      },
                      dependencies: [this.$state.expanded]
                    },
                    props: {
                      variant: 'mso:chevron_right',
                    },
                    events: {
                      click: (e) => {
                        e.stopPropagation();
                        
                        if(!this.state.expanded) {
                          for(let item of (this.data as TreeItemAttribute)) {
                            this.elements.children.addElement({
                              tagName: 'tree-view-item',
                              children: this.scope.itemSlotConfig?.children,
                              data: (item as IMonoDataAttribute),
                            }, { context: item.value }); 
                          }
                        } else {
                          this.elements.children.replaceChildren();
                        }
              
                        this.state.expanded = !this.state.expanded;
                      }
                    }
                  } 
                  : {
                    tagName: 'icon',
                    props: {
                      variant: 'mso:x', //empty icon
                    }
                  },
              ]
            },
            ...(this.config.children as ChildTemplate[]) || []
          ],
          data: this.data,
          events: {
            click: (e) => {
              this.scope.selected = this;
            },
            dblclick: (event) => {
              executeMethod(
                this.scope.itemSlotConfig.events?.dblclick, 
                this.owner, 
                [event, (this.data as TreeItemAttribute).value]
              );
            }
          }
        },
        {
          tagName: 'box',
          alias: 'children',
          scope: 'tree-view',
          className: 'children',
        }
      ],
    };
  }
}
