import { customElement, DefineElement } from '@/ui/core/base';
import { ElementConfig } from '@/types';
import description from './text.desc';

const tagName = 'text';

@DefineElement(tagName)
export default class Text extends customElement(description) {
	render(): ElementConfig {
		return {
			...this.config, 
			props: {
				innerHTML: this.state.value || tagName
			},
		};
	}
}
