
import { Component, DefineComponent } from '@/core';
import type { ComponentOptions } from '@/core';
import { DataAttribute, IMonoDataAttribute } from '@/core/data';
import { Template } from '@/core/types';

import { specification, INumberInputComponent } from './number-input.types';

@DefineComponent('number-input')
export default class NumberInput extends Component<INumberInputComponent>(specification) {

	constructor({ stateDefinition, ...rest }: ComponentOptions) {
		stateDefinition = stateDefinition || {};
		stateDefinition.inputValue = { type: 'string', defaultValue: '' };
		super({ stateDefinition, ...rest });
	}

	render(): Template {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
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
						dependencies: [this.config.data as DataAttribute],
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
						(this.data as IMonoDataAttribute).value = (e.target as HTMLInputElement)!.value;
						this.state.inputValue.value = (this.data as IMonoDataAttribute).value;
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
