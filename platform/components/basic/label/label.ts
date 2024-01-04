import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, ILabelComponent } from './label.types';

@DefineComponent('label')
export default class Label extends Component<ILabelComponent>(specification) {
	render(): Template {
		return {
			...this.config, 
			props: {
				innerHTML: this.data || this.props?.value || ''
			},
		};
	}
}
