import { buildElement } from './core/fabric';
import { DataAttribute } from './state';

import './ui/components';
import './style.scss';

import template from './template';
import { BaseClass } from './ui/core/base';
import { ContextState } from './types';

export async function loadApp(root: HTMLElement): Promise<void> {
	const app = await defineApp(root);
	if(app) {
		root.appendChild(app);
	}
}

export async function defineApp(root: HTMLElement): Promise<BaseClass | undefined> {

	const viewConfig = (await import('app/pages/index/index.conf')).default;
	const viewModule = (await import('app/pages/index/index'));
	const viewState = (await import('app/pages/index/index.state')).default;

	const typesDefaultValuesMap = {
		'string': ''
	} as const;

	const context: ContextState = {};
	Object.entries(viewState).map(([name, value]) => {
		context[name] = new DataAttribute(typesDefaultValuesMap[value as keyof typeof typesDefaultValuesMap]);
	});

	const box = buildElement(root as BaseClass, viewConfig, {}, context, viewModule) as BaseClass;

	return box as BaseClass;
}
