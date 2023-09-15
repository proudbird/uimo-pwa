import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, IButtonComponent } from './button.types';

@DefineComponent('button')
export default class Button extends Component<IButtonComponent>(specification) {
	render(): Template {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size} variant-accent treatment-fill ${this.state.processing ? 'processing' : ''}`;}
			},
			attributes: {
				role: 'button',
				disabled: !!this.props.disabled
			}, 
			children: [{
				tagName: 'label',
				props: {
					value: this.props.label || this.tagName
				},
			}]
		};
	}
}
