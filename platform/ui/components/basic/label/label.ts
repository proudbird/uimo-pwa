import { customElement, DefineElement } from '@/ui/core/base';
import { ElementConfig } from '@/types';
import description from './label.desc';

const tagName = 'label';

@DefineElement(tagName)
export default class Label extends customElement(description) {
	render(): ElementConfig {
		return {
			...this.config, 
			props: {
				innerHTML: this.state.value || tagName
			},
		};
	}
}
