import { Component, DefineComponent } from '@/core';

import { specification, ITabsItemsComponent } from './tabs-items.types';

@DefineComponent('tabs-items')
export default class TabsItems extends Component<ITabsItemsComponent>(specification) {
  static scopeName = 'tabs';
}

