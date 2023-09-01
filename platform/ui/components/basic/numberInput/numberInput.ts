
import { customElement, DefineElement } from '@/ui/core/base';
import { ElementConfig } from '@/types';
import description from './numberInput.desc';
import StringAttribute from '../../../../core/data/string';
import Context from '../../../../core/data/context';

const tagName = 'numberinput';

@DefineElement(tagName)
export default class NumberInput extends customElement(description) {

	constructor(...args: any[]) {
		const state = new Context({ inputValue: 'string' });
		args[2].state = state;
		super(...args);
	}

	render(): ElementConfig {
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
						this.data.value = (e.target as HTMLInputElement)!.value;
						this.state.inputValue.value = this.data.value;
						this.config.events?.input?.(e);
					}
				}
			}]
		};
	}
}
