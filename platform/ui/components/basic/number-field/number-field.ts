import { CustomElement, DefineElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, INumberFieldComponent } from './number-field.types';
import { genId } from '@/utils/helpers';

@DefineElement('number-field')
export default class NumberField extends CustomElement<INumberFieldComponent>(description) {
	render(): ElementDefinition {
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
					value: this.props.label,
					size: this.props.size,
					for: inputId
				}
			},{
				tagName: '@numberinput',
				props: {
					inputId,
					size: this.props.size
				},
				data: this.config.data,
			}]
		};
	}
}
