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
					return `size-${this.props.size} variant-${this.props.variant} treatment-${this.props.treatment} ${this.state.processing ? 'processing' : ''}`;}
			},
			attributes: {
				role: 'button',
				tabIndex: '0',
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
