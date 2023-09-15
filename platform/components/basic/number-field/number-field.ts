import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, INumberFieldComponent } from './number-field.types';
import { genId } from '@/utils/helpers';

@DefineComponent('number-field')
export default class NumberField extends Component<INumberFieldComponent>(specification) {
	render(): Template {
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
