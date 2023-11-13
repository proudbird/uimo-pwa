import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, IActionButtonComponent } from './action-button.types';

@DefineComponent('action-button')
export default class ActionButton extends Component<IActionButtonComponent>(specification) {
  render(): Template {
		return {
			...this.config,
			className: {
				handler: () => `size-${this.props.size}`,
      },
			attributes: {
				role: 'button',
				disabled: !!this.props.disabled
			}
		};
	}
}

