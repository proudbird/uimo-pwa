
import { customElement, DefineElement } from '@/ui/core/base';
import { ElementDefinition, IDataAttribute } from '@/types';
import description from './textInput.desc';

const tagName = 'textinput';

@DefineElement(tagName)
export default class TextInput extends customElement(description) {
	render(): ElementDefinition {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.size}`;}
			},
			children: [{
				tagName: 'input',
				id: String(this.config?.props?.inputId) || '',
				props: {
					value: this.data,
				},
				events: {
					input: (e: Event) => {
						(this.data as IDataAttribute).value = (e.target as HTMLInputElement)!.value;
						const handler = this.config.events?.input;
						if(handler) {
							if(typeof handler === 'string') {
								const moduleHandler = (this.owner as any)[handler];
								if(moduleHandler) {
									moduleHandler(e);
								} else {
									throw new Error(`Handler ${handler} not found in module`);
								};
							} else {
								handler(e);
							}
						}
					}
				}
			}]
		};
	}
}
