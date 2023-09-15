import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';

import { specification, ITextComponent } from './text.types';

@DefineComponent('text')
export default class Text extends Component<ITextComponent>(specification) {
	render(): Template {
		return {
			...this.config, 
			props: {
				innerHTML: this.data
			},
		};
	}
}
