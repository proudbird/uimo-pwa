import { CustomElement, DefineElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, IButtonComponent } from './button.types';

@DefineElement('button')
export default class Button extends CustomElement<IButtonComponent>(description) {
	render(): ElementDefinition {
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
