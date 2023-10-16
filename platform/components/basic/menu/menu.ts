import { Component, ComponentOptions, DefineComponent } from '@/core';

import { specification, IMenuComponent } from './menu.types';

@DefineComponent('menu')
export default class Menu extends Component<IMenuComponent>(specification) {

  static scope = 'menu';

  constructor({ ...rest }: ComponentOptions) {
    const stateDefinition = {
      selectedItem: { type: 'Element' },
    };

    super({ ...rest, stateDefinition });
  }
}

