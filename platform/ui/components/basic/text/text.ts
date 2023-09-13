import { CustomElement, DefineElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, ITextComponent } from './text.types';

@DefineElement('text')
export default class Text extends CustomElement<ITextComponent>(description) {
	render(): ElementDefinition {
		return {
			...this.config, 
			props: {
				innerHTML: this.data
			},
		};
	}
}
