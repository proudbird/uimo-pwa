
import { Component, DefineComponent } from '@/core';
import { IMonoDataAttribute } from '@/core/data';
import { Template } from '@/core/types';

import { specification, ITextInputComponent } from './text-input.types';

@DefineComponent('text-input')
export default class TextInput extends Component<ITextInputComponent>(specification) {
	render(): Template {
		return {
			...this.config,
			attributes: {
				...this.config.attributes,
				'tabindex': 0
			},
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: 'input',
				id: String(this.config?.props?.inputId) || '',
				props: {
					value: this.config.data || '',
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
					},
				}
			}],
			events: {
				focus: () => {
					const inputElement = this.firstChild as HTMLInputElement;
					inputElement.focus();
					inputElement.setSelectionRange(0, inputElement.value.length);
				}
			}
		};
	}
}
