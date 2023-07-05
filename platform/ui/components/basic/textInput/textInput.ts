
import { customElement, DefineElement } from '@/ui/core/base';
import { ElementConfig } from '@/types';
import description from './textInput.desc';

const tagName = 'textinput';

@DefineElement(tagName)
export default class TextInput extends customElement(description) {
	render(): ElementConfig {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: 'input',
				id: String(this.config?.props?.inputId) || '',
				props: {
					value: this.state.value
				},
				events: {
					input: (e: Event) => this.state.value.value = (e.target as HTMLInputElement)!.value
				}
			}]
		};
	}
}
