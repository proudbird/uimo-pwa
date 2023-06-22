
import { customElement, DefineElement } from '@/ui/core/base';
import { ElementConfig } from '@/types';
import description from './button.desc';

const tagName = 'button';

@DefineElement(tagName)
export default class Button extends customElement(description) {
	render(): ElementConfig {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size} variant-accent treatment-fill ${this.props.processing ? 'processing' : ''}`;}
			},
			attributes: {
				role: 'button',
				disabled: this.state.disabled
			}, 
			children: [{
				tagName: 'uimo-label',
				props: {
					value: this.state.label || tagName
				},
			}]
		};
	}
}
