import { CustomElement, DefineElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, ITextFieldComponent } from './text-field.types';
import { genId } from '@/utils/helpers';

@DefineElement('text-field')
export default class TextField extends CustomElement<ITextFieldComponent>(description) {
	render(): ElementDefinition {
		const inputId = genId();
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: 'fieldlabel',
				props: {
					value: this.props.label,
					size: this.props.size,
					for: inputId
				}
			},{
				tagName: 'textinput',
				props: {
					inputId,
					size: this.props.size
				},
				data: this.config.data,
			}]
		};
	}
}
