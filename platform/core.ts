import './ui/components';
import './style.scss';

import View from './ui/core/view';
import loadModule from './core/loadModule';

export async function loadApp(root: HTMLElement): Promise<void> {
	const app = await defineApp();
	if(app) {
		root.appendChild(app);
	}
}

export async function defineApp(): Promise<HTMLElement | undefined> {

	await loadModule('/app/index/view/Admin.Views.Index');

	const viewDefinition = window.views['Admin.Views.Index'];

	if(viewDefinition.error) {
		const errorContainer = document.createElement('div');
		errorContainer.innerHTML = `
			<h1>Error</h1>
			<p>${viewDefinition.error}</p>
		`;
		return errorContainer;
	}

	const { layout, data, module } = viewDefinition;
	const view = new View(layout, data, module);

	return view.node;
}
