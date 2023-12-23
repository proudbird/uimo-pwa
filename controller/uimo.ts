import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import loadView from './loadView';
import loadModule from './loadModule';

let instance: Uimo;

class Uimo {
	constructor() {
		if(instance) return instance;
		
		instance = this;
	}

	paths = {
		public: '../../public/',
		platform: '../../platform/',
	};

	index(appId: string): string {
		const filePath = join(__dirname, this.paths.public, 'index.html');
		if(existsSync(filePath)) {
			const indexPage = readFileSync(filePath, 'utf-8');
			return indexPage.replace('__APP_ID__ = undefined', `__APP_ID__ = ${appId}`);
		} else {
			const message = 'Can\'t find index.html file';
			console.log(message);
			return message;
		}
	}

	static(): string {
		return join(__dirname, this.paths.public);
	}

	/**
 * Load a view module based on the provided path and viewId.
 *
 * @param pathToCubes The base path to the view modules.
 * @param viewId The ID of the view module to load.
 * @returns A promise that resolves to the view module code or map.
 */
	loadView = loadView;

	loadModule = loadModule;
}

export { Uimo };
