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
			attributes: {
				...this.config.attributes,
				'tabindex': 0
			},
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
				alias: 'input',
				props: {
					inputId,
					size: this.props.size
				},
				data: this.data,
			}],
			events: {
				...this.config.events,
				focus: () => {
					this.elements.input?.focus();
				}
			}
		};
	}
}
