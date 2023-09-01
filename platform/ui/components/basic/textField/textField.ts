//@ts-nocheck
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
					return `size-${this.size}`;}
			},
			children: [{
				tagName: '@fieldlabel',
				props: {
					value: this.props.label,
					size: this.props.size,
					for: inputId
				}
			},{
				tagName: '@textinput',
				props: {
					inputId,
					size: this.props.size
				},
				data: this.config.data,
			}]
		};
	}
}
