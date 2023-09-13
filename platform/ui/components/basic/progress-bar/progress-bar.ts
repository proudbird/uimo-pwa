import { DefineElement, CustomElement } from '@/core';
import { ElementDefinition } from '@/types';

import { description, IProgressBarComponent } from './progress-bar.types';

@DefineElement('progress-bar')
export default class ProgressBar extends CustomElement<IProgressBarComponent>(description) {
	render(): ElementDefinition {
		return {
			...this.config, 
			className: {
				handler: () => `${this.props.indeterminate ? 'indeterminate' : ''} ${this.config.className || ''}`,
			},
			children:[
				{
					tagName: 'div',
					alias: 'track',
					className: 'track',
					children:[
						{
							tagName: 'div',
							alias: 'filler',
							className: 'fill',
						}
					]
				}
			]
		};
	}
}
