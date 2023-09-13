import { CustomElement, DefineElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, IFieldLabelComponent } from './field-label.types';

@DefineElement('field-label')
export default class FieldLabel extends CustomElement<IFieldLabelComponent>(description) {
	render(): ElementDefinition {
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
