import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, IFieldLabelComponent } from './field-label.types';

@DefineComponent('field-label')
export default class FieldLabel extends Component<IFieldLabelComponent>(specification) {
	render(): Template {
		return {
			...this.config, 
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: 'native:label',
				props: {	
					htmlFor: this.config.props?.for || '',
					innerHTML: this.config.props?.value || this.tagName
				},
			}]
		};
	}
}
