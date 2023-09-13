import { CustomElement, DefineElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, ILabelComponent } from './label.types';

@DefineElement('label')
export default class Label extends CustomElement<ILabelComponent>(description) {
	render(): ElementDefinition {
		return {
			...this.config, 
			props: {
				innerHTML: this.props?.value || this.tagName
			},
		};
	}
}
