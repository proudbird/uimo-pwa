import { Component, DefineComponent } from '@/core';

import { specification, ITabsBodyComponent } from './tabs-body.types';

@DefineComponent('tabs-body')
export default class TabsBody extends Component<ITabsBodyComponent>(specification) {
  static scopeName = 'tabs';
}

