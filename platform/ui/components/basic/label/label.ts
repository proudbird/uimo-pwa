import { customElement, DefineElement } from '@/ui/core/base';
import { ElementDefinition } from '@/types';
import description from './label.desc';

const tagName = 'label';

@DefineElement(tagName)
export default class Label extends customElement(description) {
	render(): ElementDefinition {
		return {
			...this.config, 
			props: {
				innerHTML: this.props?.value || tagName
			},
		};
	}
}
