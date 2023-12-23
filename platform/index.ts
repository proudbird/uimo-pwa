import { loadApp } from './app';
import ApplicationClass from './core/application';

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
				try {
					const result = await Application.courier.post('method',
						{
							cube: target.cube,
							className: target.className,
							object: target.name,
							method: prop,
							args: args,
						}
					);
					resolve(result);
				} catch(error) {
					reject(error);
				}
			});
		};
	}
};

window.Application = new ApplicationClass();
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

