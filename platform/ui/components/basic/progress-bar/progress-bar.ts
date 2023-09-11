import { customElement, DefineElement } from '@/ui/core/base';
import { ElementDefinition } from '@/types';

import description from './progress-bar.desc';

const tagName = 'progress-bar';

@DefineElement(tagName)
export default class ProgressBar extends customElement(description) {
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
