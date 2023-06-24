import { ChildElemetConfig, ContextState } from './types';

const template = (context: ContextState): ChildElemetConfig => {
	return {
		tagName: 'uimo-box',
		alias: 'Box_01',
		className: 'custom-box',
		events: {
			onclick: () => console.log('Works too!')
		},
		children: [
			{
				tagName: 'uimo-button',
				alias: 'Button',
				events: {
					click: function (this: any) {
						this.props.size = 'large';
						this.props.label = 'Clicked!';
					} 
				}, 
				props: {
					label: context.buttonLabel
				}
			}
		]
	};
};

export default template;