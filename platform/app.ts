import './components';
import './style.scss';

import View from './core/view';
import loadModule from './core/loadModule';

import appFrame from './components/builtIn/app-frame';
import { default as ApplicationClass } from './core/application';
import { ViewParams } from './core/types';
import Reference from './core/objects/reference';

declare var Application: ApplicationClass;

type AppMemberPath = {
  module: string;
  clientModule: string;
};

export type AppMember = AppMemberPath & Partial<{
  [name: string]: AppMember;
}>;

export declare type ApplicationStructure = {
  id: string;
  path: string;
  cubes: Record<string, AppMember>;
}

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
			Application.showView(queryParams.view, { ...viewParams });
		}
	}
}

export async function defineApp(): Promise<HTMLElement | undefined> {

	const { layout, data, getModule } = appFrame;

	//@ts-ignore
	const view = new View('app-frame', layout, data, getModule);

	window.Application.appFrame = view;
	const result = (await window.Application.courier.post('init')) as ApplicationStructure;

	for(const [cubeName, cube] of Object.entries(result.cubes)) {

		if(cube.clientModule) {
			try {
				await loadModule(`cube`, cubeName);
			} catch (error) {
				console.log(error);
			}
		};

		for(const [moduleName, module] of Object.entries(cube['Modules'] || {})) {

			if((module as AppMember)?.clientModule) {
				try {
					await loadModule(`module`, `${cubeName}.${moduleName}`);
				} catch (error) {
					console.log(error);
				}
			}
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
