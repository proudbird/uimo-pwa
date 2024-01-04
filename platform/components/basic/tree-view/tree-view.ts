import { Component, DefineComponent } from '@/core';
import type { ChildTemplate, ComponentOptions, IComponent, PolyChildTemplate } from '@/core/types';
import type { IMonoDataAttribute } from '@/core/data';
import { CollectionDataAttributeLoadEvent } from '@/core/data/events';
import TreeAttribute from '@/core/data/attribute/tree';

import { specification, ITreeViewComponent } from './tree-view.types';

@DefineComponent('tree-view')
export default class TreeView extends Component<ITreeViewComponent>(specification) {

  constructor({ config, stateDefinition, owner, ...rest }: ComponentOptions) {
    config = config || {};
    config.scope = 'tree-view';

    const itemSlot = (config.children as PolyChildTemplate[])?.find(slot => slot.tagName === 'item');

    stateDefinition = {
      itemSlotConfig: { type: 'Variable', initValue: itemSlot },
      selected: { type: 'Variable' },
    };

    super({ config, stateDefinition, owner, ...rest });

    this.data.addEventListener('load', (e) => {
      const { data }: CollectionDataAttributeLoadEvent<TreeAttribute> = e as any;

      for(let item of data) {
        this.addElement({
          tagName: 'tree-view-item',
          children: itemSlot?.children,
          data: (item as IMonoDataAttribute),
        }, { context: item.value }) as IComponent; 
      }
    });
  }
}
