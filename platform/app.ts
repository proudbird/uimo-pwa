import './components';
import './style.scss';

import View from './core/view';
import loadModule from './core/loadModule';

import appFrame from './components/builtIn/app-frame';
import { default as ApplicationClass } from './core/application';
import { ViewParams } from './core/types';
import Reference from './core/objects/reference';

declare var Application: ApplicationClass;

export async function loadApp(root: HTMLElement): Promise<void> {
	const app = await defineApp();
	if(app) {
		root.appendChild(app);
	}

	const params = location.search.split('?');
	if(params.length > 1) {
		const query = params[1];
		const queryParts = query.split('&');
		const queryParams: Record<string, string> = {};
		for(const queryPart of queryParts) {
			const [key, value] = queryPart.split('=');
			queryParams[key] = value;
		}

		const viewParams = {} as ViewParams;
		if(queryParams.key) {
			viewParams['reference'] = { id: queryParams.key } as Reference;
		}

		if(queryParams.view) {
			console.log(`App reload with view ${queryParams.view}`)
			Application.showView(queryParams.view, { ...viewParams });
		}
	}
}

export async function defineApp(): Promise<HTMLElement | undefined> {

	const { layout, data, getModule } = appFrame;

	//@ts-ignore
	const view = new View('app-frame', layout, data, getModule);

	window.Application.appFrame = view;

	const path = location.pathname.split('/');
	const appName = path[2];

	const response = await fetch(`/app/${appName}/init/`, {
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
