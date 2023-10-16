import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, ITextFieldComponent } from './text-field.types';
import { genId } from '@/utils/helpers';

@DefineComponent('text-field')
export default class TextField extends Component<ITextFieldComponent>(specification) {
	render(): Template {
		const inputId = genId();
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: 'field-label',
				props: {
					value: this.props.label,
					size: this.props.size,
					for: inputId
				}
			},{
				tagName: 'text-input',
				props: {
					inputId,
					size: this.props.size
				},
				data: this.data,
			}]
		};
	}
}
