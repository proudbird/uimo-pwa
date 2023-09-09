
import { customElement, DefineElement } from '@/ui/core/base';
import { type CustomElementOptions, ElementDefinition, DataAttribute } from '@/types';
import description from './numberInput.desc';

const tagName = 'numberinput';

@DefineElement(tagName)
export default class NumberInput extends customElement(description) {

	constructor({ stateDefinition, ...rest }: CustomElementOptions) {
		stateDefinition = stateDefinition || {};
		stateDefinition.inputValue = { type: 'string', defaultValue: '' };
		super({ stateDefinition, ...rest });
	}

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
				attributes: {
					type: 'text',
					inputmode: 'numeric',
				},
				props: {
					value: {
						handler: () => {
							return this.state.inputValue.value || '';
						},
						dependencies: [this.data],
					},
				},
				events: {
					input: (e: Event) => {
						const value = (e.target as HTMLInputElement)!.value;
						if(/(\.|\,)$/.test(value)) {
							// do nothing
							this.state.inputValue.value = value;
							return;
						}
						(this.data as DataAttribute).value = (e.target as HTMLInputElement)!.value;
						this.state.inputValue.value = (this.data as DataAttribute).value;
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
