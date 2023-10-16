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

	const { layout, data, getModule } = appFrame;

	//@ts-ignore
	const view = new View('app-frame', layout, data, getModule);

	window.Application.appFrame = view;

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

	return view.node;
}
