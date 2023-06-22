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
				alias: 'button',
				events: {
					click: function (this: any) {
						this.props.size = 'large';
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