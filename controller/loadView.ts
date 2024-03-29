import { existsSync, readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { runInThisContext } from 'node:vm';
import { Output, transform, transformFile } from '@swc/core';
import { parse as parseYml } from 'yaml';
import injectGlobals from './injectGlobals';
import defineGlobals from './defineGlobals';
import transformCode from './transform';

// Type definition for the ViewModule
interface ViewModule {
  code: string;
  map: string;
}

// Type definition for the ViewCache
interface ViewCache {
  [viewId: string]: { code: string; globals: any, map: string };
}

// Cache object to store the loaded views
const cache: ViewCache = {};

/**
 * Load a view module based on the provided path and viewId.
 *
 * @param pathToCubes The base path to the view modules.
 * @param viewId The ID of the view module to load.
 * @returns A promise that resolves to the view module code or map.
 */
export default async function loadView(
	pathToCubes: string,
	viewId: string
): Promise<string> {
	return new Promise(async (resolve) => {
		// If the viewId ends with '.js.map', return the corresponding map from the cache.
		if (viewId.includes('.js.map')) {
			resolve(cache[viewId.replace('.js.map', '')].map);
		}

		/**
		 * Cache is turn off before cache update mechanism will be implemented
		 */
		// If the view module is already cached, return the corresponding code from the cache.
		// if (cache[viewId] && cache[viewId].code) {
		// 	resolve(cache[viewId].code);
		// }

		// Extract the viewName and relativeModuleFilePath from the viewId.
		const viewIdParts = viewId.split('.');
		const cubeName = viewIdParts[0];
		const className = viewIdParts[1];
		let modelName = viewIdParts[2];
		let viewName: string
		let relativeModuleFilePath: string;
		if(className === 'Views') {
			viewName = modelName;
			relativeModuleFilePath = `${cubeName}/${className}/${viewName}`;
		} else {
			viewName = viewIdParts[3];
			relativeModuleFilePath = `${cubeName}/${className}/${className}.${modelName}.Views/${viewName}`;
		}

		try {
			// Load the view definition, data, and module.
			const { layout, data, module, style } = await getViewDefinitions(
				pathToCubes,
				relativeModuleFilePath,
				viewName
			);

			const globals = defineGlobals(module.code, cubeName, ['Catalogs', 'Modules']);
			const globalsNames = [...Object.keys(globals.cubes), ...Object.keys(globals.objects)].join(', ');

			// Generate the result string with the view module code, layout, and data.
			const result = `(() => { const module = {}; window.views["${viewId}"] = { layout: ${JSON.stringify(
				layout
			)}, data: ${JSON.stringify(data)}, style: "${style}", getModule: (View) => { ((exports, View, ${globalsNames}) => { ${
				module.code
			} })(module, View, ...defineGlobals(${JSON.stringify(globals)})); return module }};})();//# sourceMappingURL=${viewId}.js.map`;

			// Cache the result and resolve the promise with the result.
			cache[viewId] = { code: result, globals, map: module.map };
			resolve(result);
		} catch (error) {
			// If an error occurs during loading, resolve the promise with an error mark.
			resolve(errorMark(viewId, (error as Error).message));
		}
	});
}

/**
 * Load the view definition, data, and module based on the provided path, viewName, and relativeModuleFilePath.
 *
 * @param pathToCubes The base path to the view modules.
 * @param relativeModuleFilePath The relative file path to the view modules.
 * @param viewName The name of the view.
 * @returns A promise that resolves to an object containing the layout, data, and module.
 * @throws If any of the view components (layout, data, module) cannot be loaded.
 */
async function getViewDefinitions(
	pathToCubes: string,
	relativeModuleFilePath: string,
	viewName: string
): Promise<{ layout: any; data: any; module: ViewModule, style: string }> {
	let layout: any;
	let data: any;
	let module: ViewModule;
	let style: string;

	try {
		layout = await getViewConfig('layout', resolvePath(pathToCubes, relativeModuleFilePath), viewName);
		if (!layout) {
			throw new Error(`Can not find view layout file for ${viewName}`);
		}
	} catch (error) {
		throw new Error(`Can not get view layout file for ${viewName}: ${(error as Error).message}`);
	}

	try {
		data = await getViewConfig('data', resolvePath(pathToCubes, relativeModuleFilePath), viewName);
	} catch (error) {
		throw new Error(`Can not get view data file for ${viewName}: ${(error as Error).message}`);
	}

	try {
		module = await getViewModule(resolvePath(pathToCubes, relativeModuleFilePath), viewName, `${relativeModuleFilePath}/${viewName}`);
	} catch (error) {
		throw new Error(`Can not get view module file for ${viewName}: ${(error as Error).message}`);
	}

	try {
		style = getStyle(resolvePath(pathToCubes, relativeModuleFilePath), viewName);
	} catch (error) {
		throw new Error(`Can not get style file for ${viewName}: ${(error as Error).message}`);
	}

	return { layout, data, module, style };
}

/**
 * Load the view definition (layout or data) based on the provided type, path, and viewName.
 *
 * @param type The type of view definition (layout or data).
 * @param pathToView The base path to the view definitions.
 * @param viewName The name of the view.
 * @returns A promise that resolves to the loaded view definition.
 */
async function getViewConfig(
	type: 'layout' | 'data',
	pathToView: string,
	viewName: string
): Promise<any> {
	const fileId = type;
	const loaders: { [key: string]: (filePath: string) => any } = {
		json: require,
		yml: loadYmlFile,
		yaml: loadYmlFile,
		js: require,
		ts: loadTsFile,
		tsx: loadTsFile
	};

	for (const [extension, loader] of Object.entries(loaders)) {
		const filePath = resolvePath(pathToView, `${viewName}.${fileId}.${extension}`);
		if (existsSync(filePath)) {
			try {
				return await loader(filePath);
			} catch (error) {
				throw new Error(`Can not parse view ${type} file ${filePath}`);
			}
		}
	}

	return null;
}

/**
 * Load and parse a YAML file from the provided filePath.
 *
 * @param filePath The path to the YAML file.
 * @returns The parsed YAML content.
 */
function loadYmlFile(filePath: string): any {
	const content = readFileSync(filePath, 'utf-8');
	try {
		return parseYml(content);
	} catch (error) {
		console.log(error);
	}
}

/**
 * Load and transform a TypeScript file from the provided filePath.
 *
 * @param filePath The path to the TypeScript file.
 * @returns The loaded and transformed module.
 */
async function loadTsFile(filePath: string): Promise<any> {
	const source = readFileSync(filePath, 'utf8');
	let result: Output = { code: '', map: '' };
	// let result = await transform(source, {
	// 	filename: filePath,
	// 	module: {
	// 		type: 'commonjs',
	// 	},
	// 	isModule: true,
	// 	jsc: {
	// 		parser: {
	// 			syntax: 'typescript',
	// 		},
	// 		transform: {},
	// 	},
	// });

	try {
		//@ts-ignore
		const transformed = await transformCode(source, filePath) as Output;
		result = transformed;
	} catch (error) {
		console.log(error);
	}

	try {
		const module = runInThisContext(`var exports = {}; ${result.code}`);
		return module;
	} catch (error) {
		throw new Error(`Can not load view module file ${filePath}: ${(error as Error).message}`);
	}
}

/**
 * Load the view module (JavaScript or TypeScript) based on the provided path, viewName, and fileAlias.
 *
 * @param pathToView The base path to the view modules.
 * @param viewName The name of the view.
 * @param fileAlias The alias for the view file.
 * @returns A promise that resolves to the loaded view module.
 */
async function getViewModule(
	pathToView: string,
	viewName: string,
	fileAlias: string
): Promise<ViewModule> {
	const loaders: { [key: string]: (filePath: string) => Promise<ViewModule> } = {
		js: async (filePath: string) => ({ code: readFileSync(filePath, 'utf8'), map: '' }),
		ts: loadModuleTsFile,
		tsx: loadModuleTsFile,
	};

	for (const [extension, loader] of Object.entries(loaders)) {
		const filePath = resolvePath(pathToView, `${viewName}.${extension}`);
		if (existsSync(filePath)) {
			try {
				return await loader(filePath);
			} catch (error) {
				throw new Error(`Can not parse view module file ${filePath}`);
			}
		}
	}

	return {} as ViewModule;
}

/**
 * Load and transform a TypeScript module file from the provided filePath and fileAlias.
 *
 * @param filePath The path to the TypeScript module file.
 * @param fileAlias The alias for the module file.
 * @returns The loaded and transformed module.
 */
export async function loadModuleTsFile(filePath: string): Promise<any> {
	const source = readFileSync(filePath, 'utf8');
	let result: Output = { code: '', map: '' };

	try {
		//@ts-ignore
		result = (await transformCode(source, filePath)) as Output;
	} catch (error) {
		console.log(error);
	}

	// result.code = injectGlobals(result.code, ['Catalogs']);
	// return { code: result.code?.replace('var a = 0;', '') || '', map: result.map?.replace('var a = 0;', '') || '' };
	return { code: result.code, map: result.map };
}

/**
 * Create an error mark for the specified viewId and error message.
 *
 * @param viewId The ID of the view module.
 * @param errorMessage The error message.
 * @returns The error mark string.
 */
function errorMark(viewId: string, errorMessage: string): string {
	return `(() => { window.views["${viewId}"] = { error: "${errorMessage}" }; })();`;
}
function getStyle(pathToView: string, viewName: string): string {
	const filePath = resolvePath(pathToView, `${viewName}.css`);
	if (existsSync(filePath)) {
		let result = '';
		try {
			const content = readFileSync(filePath, 'utf-8');
			result = content.replace(/(\r\n|\n|\r|\t)/gm, ' ').replace(/(\s\s)/gm, ' ').replace(/"/g, '\\"');
			return result;
		} catch (error) {
			throw new Error(`Can not read view style file ${filePath}`);
		}
	} else {
		return '';
	}
}