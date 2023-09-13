
import { CustomElement, DefineElement } from '@/core';
import { IMonoDataAttribute } from '@/core/data';
import { ElementDefinition } from '@/types';

import { description, ITextInputComponent } from './text-input.types';

@DefineElement('text-input')
export default class TextInput extends CustomElement<ITextInputComponent>(description) {
	render(): ElementDefinition {
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
					value: this.data,
				},
				events: {
					input: (e: Event) => {
						(this.data as IMonoDataAttribute).value = (e.target as HTMLInputElement)!.value;
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
