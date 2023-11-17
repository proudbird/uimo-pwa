import { Component, DefineComponent } from '@/core';
import { ChildTemplate, Template } from '@/core/types';

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
			},
			children: [
				...[this.props.label ? {
					tagName: 'label',
					props: {
						value: this.props.label || ''
					},
				} : {} as ChildTemplate],
				...(this.config.children as ChildTemplate[] || [])
			]
		};
	}
}

