import { DefineComponent, Component } from '@/core';
import { Template } from '@/core/types';

import { specification, IProgressBarComponent } from './progress-bar.types';

@DefineComponent('progress-bar')
export default class ProgressBar extends Component<IProgressBarComponent>(specification) {
	render(): Template {
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
