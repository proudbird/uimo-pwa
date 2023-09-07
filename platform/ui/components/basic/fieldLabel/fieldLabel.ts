import { customElement, DefineElement } from '@/ui/core/base';
import { ElementDefinition } from '@/types';
import description from './fieldLabel.desc';

const tagName = 'fieldlabel';

@DefineElement(tagName)
export default class FieldLabel extends customElement(description) {
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
					innerHTML: this.config.props?.value || tagName
				},
			}]
		};
	}
}
