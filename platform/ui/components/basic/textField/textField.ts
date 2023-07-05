
import { customElement, DefineElement } from '@/ui/core/base';
import { ElementConfig } from '@/types';
import description from './textField.desc';
import { genId } from '@/utils/helpers';

const tagName = 'textfield';

@DefineElement(tagName)
export default class TextField extends customElement(description) {
	render(): ElementConfig {
		const inputId = genId();
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: '@fieldlabel',
				props: {
					value: this.state.label,
					size: this.state.size,
					for: inputId
				}
			},{
				tagName: '@textinput',
				props: {
					inputId,
					value: this.state.value,
					size: this.state.size
				}
			}]
		};
	}
}
