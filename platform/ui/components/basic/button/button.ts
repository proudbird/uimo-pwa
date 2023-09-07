import { customElement, DefineElement } from '@/ui/core/base';
import { ElementDefinition } from '@/types';
import description from './button.desc';

const tagName = 'button';

@DefineElement(tagName)
export default class Button extends customElement(description) {
	render(): ElementDefinition {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.size} variant-accent treatment-fill ${this.processing ? 'processing' : ''}`;}
			},
			attributes: {
				role: 'button',
				disabled: !!this.props.disabled
			}, 
			children: [{
				tagName: 'label',
				props: {
					value: this.props.label || tagName
				},
			}]
		};
	}
}
