import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import loadView from './loadView';
import initApp from './initApp';
import loadModule from './loadModule';

interface UimoProps {
  pathToCubes: string;
}

let instance: Uimo;

class Uimo {
	#pathToCubes: string;

	constructor({ pathToCubes }: UimoProps) {
		if(instance) return instance;
		instance = this;
    
		this.#pathToCubes = pathToCubes;
	}

	paths = {
		public: '../../dist/',
		plarform: '../../platform/',
	};

	index(): string {
		const filePath = join(__dirname, this.paths.public, 'index.html');
		if(existsSync(filePath)) {
			return readFileSync(filePath, 'utf-8');
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

	initApp(params) {
		return initApp(params);
	}
}

export { Uimo };
