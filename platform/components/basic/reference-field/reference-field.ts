import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';
import { genId } from '@/utils/helpers';

import { specification, IReferenceFieldComponent } from './reference-field.types';

@DefineComponent('reference-field')
export default class ReferenceField extends Component<IReferenceFieldComponent>(specification) {
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
				tagName: 'reference-input',
				props: {
					inputId,
					size: this.props.size
				},
				data: this.data,
			}]
		};
	}
}

