import './components';
import './style.scss';

import View from './core/view';
import loadModule from './core/loadModule';

import appFrame from './components/builtIn/app-frame';

export async function loadApp(root: HTMLElement): Promise<void> {
	const app = await defineApp();
	if(app) {
		root.appendChild(app);
	}
}

export async function defineApp(): Promise<HTMLElement | undefined> {

	const response = await fetch(`${location.pathname}/init/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
	});
	const result = await response.json();

	for(const alias in result.cubes) {
		if(!(/\.client/.test(alias))) continue;
		try {
			await loadModule(`cube/${alias}`);
		} catch (error) {
			console.log(error);
		}
	}

	for(const alias in result.modules) {
		try {
			await loadModule(`module/${alias}`);
		} catch (error) {
			console.log(error);
		}
	}

	for(let moduleId in window.modules) {
		const module = window.modules[moduleId].getModule();
		if(module.onStart) {
			await module.onStart();
		}
	}

	const { layout, data, getModule } = appFrame;

	// await loadModule('/app/index/view/Admin.Views.register');

	// const viewDefinition = window.views['Admin.Views.register'];

	// if(viewDefinition.error) {
	// 	const errorContainer = document.createElement('div');
	// 	errorContainer.innerHTML = `
	// 		<h1>Error</h1>
	// 		<p>${viewDefinition.error}</p>
	// 	`;
	// 	return errorContainer;
	// }

	// const { layout, data, getModule } = viewDefinition;
	//@ts-ignore
	const view = new View(layout, data, getModule);

	window.Application.appFrame = view;

	return view.node;
}
