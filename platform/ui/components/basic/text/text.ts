import { customElement, DefineElement } from '@/ui/core/base';
import { ElementDefinition } from '@/types';
import description from './text.desc';

const tagName = 'text';

@DefineElement(tagName)
export default class Text extends customElement(description) {
	render(): ElementDefinition {
		return {
			...this.config, 
			props: {
				innerHTML: this.data
			},
		};
	}
}
