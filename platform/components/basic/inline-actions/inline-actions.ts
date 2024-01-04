import { Component, type ComponentOptions, DefineComponent } from '@/core';

import { specification, IInlineActionsComponent } from './inline-actions.types';
import { Template } from '@/core/types';

@DefineComponent('inline-actions')
export default class InlineActions extends Component<IInlineActionsComponent>(specification) {

  constructor({ config, stateDefinition, owner, ...rest }: ComponentOptions) {
    stateDefinition = {
      hovered: { type: 'boolean', initValue: false, inScope: false },
    };

    super({ config, stateDefinition, owner, ...rest });

    this.parent.style.position = 'relative';
    
    this.parent.addEventListener('mouseenter', () => {
        this.state.hovered = true;
      }
    );

    this.parent.addEventListener('mouseleave', () => {
        this.state.hovered = false;
      }
    );
  }

  render(): Template {
    return {
      ...this.config,
      className: {
        handler: () => {
          return this.state.hovered ? 'hover' : '';
        },
        dependencies: [this.$state.hovered]
      },
      events: {
        click: (e) => e.stopPropagation()
      }
    };
  }
}

