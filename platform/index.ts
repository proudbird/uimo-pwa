import { loadApp } from './core';
import Application from './core/application';

export class Cube {
	constructor(public name: string) {}
}

export class AppObject {
	constructor(public name: string, public cube: string, objects: any) {
		for(const appObjectName of objects) {
			const appObject = new Proxy(new Instance(cube, name, appObjectName), proxyhandler);
			// @ts-ignore
			this[appObjectName] = appObject;
		}
	}
}

class Instance {
	constructor(public cube: string, public className: string, public name: string) {}
}

const proxyhandler: ProxyHandler<Instance> = {
	get(target, prop) {
		if(prop === 'then') {
			return undefined;
		}
		return async function(...args: any[]) {
			return new Promise(async(resolve, reject) => {
				const response = await fetch(`${location.pathname}/instance/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						cube: target.cube,
						className: target.className,
						object: target.name,
						method: prop,
						args: args,
					})
				});
				const result = await response.json();
				// if(result.error) {
				// 	reject(result.error);
				// } else {
					resolve(result);
				// }
			});
		};
	}
};

window.Application = new Application();
window.cubes = {};
window.modules = {};
window.views = {};
window.defineGlobals = (globals: any) => {
	const params = [] as any;
	const cubes = {} as any;
	for(const cubeName in globals.cubes) {
		const cube = new Cube(cubeName);
		for(const appObjectName in globals.cubes[cubeName]) {
			const appObject = new AppObject(appObjectName, cubeName, globals.cubes[cubeName][appObjectName]);
			// @ts-ignore
			cube[appObjectName] = appObject;
		}
		cubes[cubeName] = cube;
		params.push(cube);
	}
	for(const key in globals.objects) {
		const appObject = new AppObject(key, globals.cube, globals.objects[key]);
		params.push(appObject);
	}

	return params;
};

const ROOT_NAME = 'app';

const root = document.getElementById(ROOT_NAME);

if(!root) {
	console.log(`HTML page dosen't have the root container with id '${ROOT_NAME}'`); 
} else {
	loadApp(root);
}

