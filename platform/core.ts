import { buildElement } from './core/fabric';
import { DataAttribute } from './state';

import './ui/components';
import './style.scss';

import template from './template';
import { BaseClass } from './ui/core/base';

export function loadApp(root: HTMLElement): void {
	const app = defineApp(root);
	if(app) {
		root.appendChild(app);
	}
}

export function defineApp(root: HTMLElement): BaseClass | undefined {
	const state = new DataAttribute<string>('Click #0');

	const box = buildElement(root as BaseClass, template({ buttonLabel: state }), {}) as BaseClass;


	return box as BaseClass;
}
